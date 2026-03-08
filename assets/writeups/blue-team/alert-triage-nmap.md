# Alert Triage — Nmap Network Scan Detection (Splunk / Windows Event Logs)

## Context

This write-up documents the detection and analysis of a network reconnaissance event observed in a controlled lab environment. This exercise is designed to practice both offensive techniques and defensive monitoring.

The goal here is not only to detect the scan, but to understand:

- why the activity generates detectable artifacts
- how to correctly triage an alert from raw Windows Event Logs
- how to map observed behavior to the MITRE ATT&CK framework
- what response actions are appropriate given the findings


### Environment

| Machine | Role | IP |
|---|---|---|
| Kali Linux | Attacker | `192.168.56.106` |
| Windows 10 | Target | `192.168.56.105` |
| Metasploitable | Secondary target | `192.168.56.108` |
| Purple Kali | SOC analyst workstation / Splunk SIEM | `192.168.56.104` |

**Detection stack:**
- Splunk Enterprise — SIEM
- Windows Event Logs: Security, System, Application, Microsoft-Windows-Sysmon/Operational
- Filtering Platform Connection audit enabled via `auditpol`

---

## Initial Alert

**Source:** Splunk — `WinEventLog:Security`  
**Timestamp:** 2026-03-07 at 02:09 PM  
**Trigger:** Abnormal volume of `EventCode=5156` events (Windows Filtering Platform — connection permitted) originating from an unknown internal IP address.

**SPL query that surfaced the anomaly:**

```spl
index=main host=Windows10 EventCode=5156 OR EventCode=5157
```

---


## Investigation

### Step 1 — Source Identification

The first event was expanded and analyzed:

```
EventCode        : 5156
Direction        : Inbound
Source address   : 192.168.56.106
Source port      : 947
Dest address     : 192.168.56.105
Dest port        : 445
Protocol         : 6 (TCP)
Process          : System
Layer            : Receive/Accept
```

**Observation:** The source IP `192.168.56.106` is not the local machine itself — it is a separate host on the internal network initiating inbound connections to W10. This immediately rules out loopback activity or legitimate system processes.

![alt text](<Capture d’écran du 2026-03-07 14-09-57.png>)

---

### Step 2 — Volume and Port Analysis

![alt text](event-scan-1.png)

To isolate and profile the suspicious traffic, the following SPL query was run:

```spl
index=main host=Windows10 EventCode=5156 Adresse_source=192.168.56.106
| stats count by Port_de_destination
| sort Port_de_destination
```

**Results:**
- **37 events** generated within under 30 seconds
- Destination ports observed: `135`, `139`, `445`, `947`, `49108` and a large number of sequential ports
- Protocol: TCP exclusively

**Attack timeline:**

```spl
index=main host=Windows10 EventCode=5156 Adresse_source=192.168.56.106
| timechart count
```

The timeline reveals a burst of activity concentrated within a **28-second window** — a pattern characteristic of automated tooling rather than human-driven behavior.


![alt text](<Capture d’écran du 2026-03-07 14-16-00.png>)

---


### Étape 3 — Corrélation avec d'autres EventCodes

A broader search was run to identify any additional artifacts:

```spl
index=main host=Windows10 EventCode=4625 OR EventCode=4648
```

![alt text](<Capture d’écran du 2026-03-07 13-59-23.png>)

**EventCode 4648 detected:** An explicit credentials logon attempt was observed targeting SMB ports (139/445). This is consistent with Nmap's `-sV` flag, which attempts service version detection by initiating partial authentication handshakes against discovered open ports.

---

### Step 4 — Tool Identification

The following indicators were collected and correlated against known scan signatures:

| Indicator | Observed value | Interpretation |
|---|---|---|
| Ports contacted | 37+ in 28 seconds | Automated scanning |
| Priority ports | 135, 139, 445 | Windows/SMB service enumeration |
| Protocol | TCP SYN only | SYN stealth scan (`-sS`) |
| Target-side process | `System` | Kernel-level connection handling |
| Source | Single IP `192.168.56.106` | Single attacker origin |

**Confirmed:** The scan was executed from AK14 using the following command:

```bash
nmap -sS -sV -p 1-1000 192.168.56.105
```

Total scan duration: 30.51 seconds — consistent with the timestamps observed in Splunk.

![alt text](<Capture d’écran du 2026-03-07 14-16-23.png>)

---


## MITRE ATT&CK Mapping

The observed behavior maps to the following techniques:

| Tactic | Technique | ID |
|---|---|---|
| Reconnaissance | Active Scanning | T1595 |
| Discovery | Network Service Discovery | T1046 |

**T1595 — Active Scanning:** The attacker directly probed the victim's infrastructure by sending TCP SYN packets across a range of ports, generating measurable network artifacts.

**T1046 — Network Service Discovery:** The attacker used Nmap's service detection (`-sV`) to identify software running on open ports, gathering information to support potential follow-on exploitation.

**Services identified by the scan:**
- Port `135` → Microsoft Windows RPC
- Port `139` → Microsoft NetBIOS-SSN
- Port `445` → Microsoft-DS (SMB)

---



## Verdict

**TRUE POSITIVE — Severity: MEDIUM**

| Criterion | Assessment |
|---|---|
| Source | Internal IP `192.168.56.106` — not authorized to conduct network scanning |
| Behavior | 37 TCP connections to distinct ports within 28 seconds |
| Pattern | 100% consistent with an Nmap `-sS -sV` scan signature |
| Impact | Network reconnaissance — no exploitation detected at this stage |

---


## Recommended Response

**Immediate actions (Tier 1):**
1. Isolate `192.168.56.106` from the network pending investigation
2. Escalate to Tier 2 with this report and preserved log evidence
3. Retain Splunk logs for the relevant time window

**Short-term actions (Tier 2):**
4. Investigate `192.168.56.106` for signs of compromise or unauthorized use
5. Review authentication logs on W10 for post-scan exploitation attempts
6. Determine whether other hosts on the network were also scanned

**Detection improvement:**

The following SPL alert can be deployed to automatically flag future scan activity:

```spl
index=main EventCode=5156
| stats dc(Port_de_destination) as unique_ports by Adresse_source
| where unique_ports > 15
```

This triggers when a single source IP contacts more than 15 distinct destination ports — a reliable heuristic for automated scanning.

---



## Sigma Detection Rule

```yaml
title: Network Port Scan Detected via Windows Filtering Platform
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
status: experimental
description: >
  Detects automated network scanning based on an abnormal volume of inbound
  TCP connections from a single source to multiple distinct destination ports.
author: Xavier TOKO-PROUST
date: 2026/03/07
references:
  - https://attack.mitre.org/techniques/T1046/
  - https://attack.mitre.org/techniques/T1595/
tags:
  - attack.reconnaissance
  - attack.discovery
  - attack.t1595
  - attack.t1046
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 5156
    Direction: Inbound
  condition: selection | count(DestPort) by SourceAddress > 15
falsepositives:
  - Authorized network monitoring tools (Zabbix, PRTG, Nessus)
  - Internal vulnerability scanners running scheduled assessments
level: medium
```

---


## Conclusion

This exercise demonstrates how a standard Nmap SYN scan leaves clear and actionable traces in Windows Event Logs, even without advanced endpoint tooling. The `EventCode 5156` artifact — generated by the Windows Filtering Platform — provides reliable visibility into inbound connection attempts when the appropriate audit policy is enabled.

It also highlights an important finding: the `-sS` stealth scan mode is not stealthy from a host-based logging standpoint. A defender with `Filtering Platform Connection` auditing enabled and a basic SPL alert will detect the scan within seconds of execution.

Effective detection does not always require complex tooling. It requires the right audit policies, a functional log pipeline, and a clear understanding of what normal traffic looks like.

---


*© Xavier TOKO-PROUST — [azar-security.site](https://azar-security.site)*