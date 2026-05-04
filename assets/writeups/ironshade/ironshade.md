# IronShade — CTF Writeup

**Platform**: TryHackMe  
**Difficulty**: Medium  
**Category**: Blue Team / Compromise Assessment  
 
---

## Overview

IronShade is a blue team challenge simulating a real-world compromise assessment. You're given direct access to a Linux host that has already been breached, and your job is to reconstruct what happened, who got in, how they persisted, and what they left behind.

---

## Reconnaissance

Even with direct access to the machine, I started with a quick `nmap` scan to get a broader picture of the exposed attack surface:

```bash
nmap -sV <target_ip>
```

![alt text](image.png)

The HTTP port was open but had nothing interesting on it. Before diving into the investigation, I grabbed the machine's identity using `hostnamectl`, which is the standard way to query or modify a Linux system's hostname and machine ID:

```bash
hostnamectl
```
![alt text](image-1.png)


---

## Identifying the Attacker's Footprint

### The Backdoor Account

The first thing to look for in any compromise assessment is unauthorized user accounts. On Linux, all accounts live in `/etc/passwd`. Legitimate system accounts use `/usr/sbin/nologin` or `/bin/false`, so filtering for real interactive shells quickly narrows things down:

```bash
cat /etc/passwd | grep "/bin/bash"
```

![alt text](image-2.png)

One account stood out immediately: **`mircoservice`**. A textbook attacker move, typosquatting a legitimate-sounding service name (`mirco` instead of `micro`) to blend into the system and avoid raising alarms during a casual review.

### Persistence via Cron

With a backdoor account identified, the next logical step was checking how the attacker ensured their access would survive a reboot. I checked the user's own crontab first,  nothing. Then the system-wide crontab and `/etc/cron.d/`, still nothing alarming. Going back to the root crontab more carefully, this line was hiding in plain sight:

```
@reboot /home/mircoservice/printer_app
```

![alt text](image-3.png)

The `@reboot` directive guarantees that `printer_app` launches automatically every time the server starts. Simple, effective, and easy to miss if you're not reading carefully.

### Running Processes & Memory Artifacts

With `printer_app` confirmed as the persistence payload, I tracked its execution using `ps`:

```bash
ps aux | grep mircoservice
```

![alt text](image-4.png)


### Malicious Services

Checking the systemd service files surfaced two suspicious entries:

```bash
ls -la /etc/systemd/system/
```

**`backup.service`** and **`strokes.service`** had no legitimate reason to exist on this host. On top of that, a service named **`.systmd`** was also present, two layers of obfuscation in one: the leading dot hides it from standard directory listings on Linux, and the typo (`systmd` vs `systemd`) is designed to impersonate a core system component at a glance.

---

## Reconstructing the Attack Timeline

### Account Creation

With the attacker's username in hand, I traced back through `/var/log/auth.log` to find exactly when the account was planted. The `-a` flag is useful here to force grep to treat binary log files as plain text:

```bash
grep -a "mircoservice" /var/log/auth.log
```

![alt text](image-6.png)

The `new user` entry confirmed the account was created on **Aug 5 at 22:05:33**.

### SSH Brute Force

Filtering the same log for SSH activity revealed a pattern of connections originating from a single IP address — **`10.11.75.247`**:

```bash
grep -a "mircoservice" /var/log/auth.log | grep "Failed" | wc -l
```

![alt text](image-7.png)

**8** failed login attempts were recorded against the backdoor account. Some log messages appeared duplicated, so counting required a bit of care.

---

## Malicious Package

Beyond the account and persistence mechanisms, the attacker also installed a malicious package on the host. Cross-referencing `/var/log/dpkg.log` with the known timeline (account created Aug 5) pointed straight to **`pscanner`**, installed on Aug 6:

```bash
grep "install" /var/log/dpkg.log
```

![alt text](image-9.png)

The name loosely stands for *print scanner*, keeping up the theme of mimicking legitimate-sounding software. Inspecting its metadata with `dpkg -s` revealed something unexpected tucked into the `Description` field:

```bash
dpkg -s pscanner
```

![alt text](image-8.png)

```
Package: pscanner
Maintainer: johnnyEng
Version: 1.5
Description: Secret_code{tRy_Hack_ME_}
```

The secret code was sitting right there in plain sight: **`{tRy_Hack_ME_}`**.

---

## Key Takeaways

- Attackers rely heavily on **typosquatting**, subtly misspelled usernames and service names (`mircoservice`, `systmd`) are designed to pass a casual review
- **`@reboot` cron entries** are one of the simplest persistence mechanisms available, yet easy to overlook when scanning a busy root crontab
- **osquery** is a powerful tool for forensic investigation, especially for surfacing in-memory artifacts that wouldn't show up in a standard file scan
- Building an **attack timeline** by correlating timestamps across `auth.log`, `dpkg.log`, and systemd service files is essential to understanding the full scope of a compromise
- Malicious packages can hide arbitrary data inside **metadata fields**, never skip `dpkg -s` when investigating unknown software