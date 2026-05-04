# Injection SQL - De l'Exploitation Error-Based à la Blind Injection (DVWA - Niveau Faible)

## Contexte
Cette analyse a été réalisée sur une application web volontairement vulnérable (DVWA) déployée localement via Docker.

L'objectif ici n'est pas seulement de démontrer une exploitation réussie, mais de comprendre :
- Pourquoi la vulnérabilité existe au niveau du code
- Comment différentes techniques d'injection peuvent être appliquées
- Quelles mesures défensives sont nécessaires pour prévenir ce type d'attaque


### Environnement

- Application : Damn Vulnerable Web Application (DVWA)
- Cible : 127.0.0.1 (localhost)
- Niveau de sécurité : Faible


Un scanner TCP Python personnalisé a été utilisé pour identifier les services ouverts sur l'hôte.

```bash
python3 scanner-python/mini_scanner.py --target 127.0.0.1 --ports 1-1024
```

**Résultat**

Le port 80 a été trouvé ouvert, confirmant qu'une application web était en cours d'exécution.

---


## Identification de la Vulnérabilité

### Tests Initiaux

Dans le module SQL Injection, un guillemet simple (') a été inséré dans le champ de saisie :

```sql
1'
```

Cela a généré une erreur de syntaxe SQL, indiquant que la saisie utilisateur était directement intégrée dans la requête SQL sans aucune sanitisation.

Cela confirme la présence d'une vulnérabilité d'**Injection SQL Error-Based**.


## Injection SQL Error-Based

L'injection SQL error-based se produit lorsque l'application expose des messages d'erreur SQL détaillés au client. Ces erreurs fournissent des informations précieuses sur la structure de la base de données et la logique des requêtes.


### Pourquoi l'Exposition des Erreurs est Critique

Les messages d'erreur SQL révèlent :
- Le type et la version du moteur de base de données
- La structure et la syntaxe des requêtes
- Les noms des tables et des colonnes dans certains cas

Ces informations accélèrent le processus d'exploitation en permettant aux attaquants de construire des payloads précis basés sur le comportement observé.

---


## Injection SQL Boolean-Based

L'injection boolean-based exploite la capacité à manipuler la logique des requêtes SQL en injectant des conditions qui modifient l'évaluation booléenne de la requête.

### Preuve de Concept

Le payload suivant a été testé :

```sql
1' OR '1'='1
```

Cette injection transforme la clause WHERE en une condition qui s'évalue toujours à vrai :

```sql
SELECT first_name, last_name FROM users WHERE user_id = '1' OR '1'='1';
```

### Résultat

L'application a retourné tous les enregistrements utilisateurs de la base de données, démontrant que la logique injectée a contourné la restriction de requête prévue.

Cette technique est fondamentale pour l'exploitation de l'injection SQL, car elle permet aux attaquants de manipuler les conditions de requête et de récupérer des données non autorisées.

---


## Injection SQL UNION-Based

L'injection UNION-Based permet de combiner des requêtes contrôlées par l'attaquant avec la requête originale.

Pour qu'une instruction UNION s'exécute correctement, les deux requêtes doivent retourner le même nombre de colonnes.

### Étape 1 : Énumération des Colonnes

La clause ORDER BY a été utilisée pour déterminer le nombre de colonnes retournées par la requête originale :

```sql
1' ORDER BY 1 --
1' ORDER BY 2 --
1' ORDER BY 3 --
```

Une erreur s'est produite lors du tri par la troisième colonne, confirmant que la requête retourne **2 colonnes**.

### Étape 2 : Vérification de Compatibilité

Pour confirmer que l'attaque UNION est viable, un payload avec des valeurs NULL a été testé :

```sql
1' UNION SELECT NULL,NULL --
```

La requête s'est exécutée sans erreur, confirmant que les deux requêtes sont compatibles.

### Étape 3 : Extraction des Informations Système

Avec la compatibilité des colonnes établie, le payload suivant a été utilisé pour extraire les métadonnées de la base de données :

```sql
1' UNION SELECT database(), version() --
```

L'application a retourné :
- Le nom de la base de données courante
- La version de MySQL

### Explication Technique

La requête injectée se fusionne avec la requête originale de la façon suivante :

```sql
SELECT first_name, last_name FROM users WHERE user_id = '1'
UNION
SELECT database(), version();
```

La base de données traite les deux instructions SELECT et retourne un jeu de résultats combiné, permettant l'extraction de données arbitraires.

L'injection UNION-based est particulièrement efficace car elle permet l'énumération systématique des structures de base de données via `information_schema`, l'extraction de credentials, et la récupération de données applicatives sensibles.

---


## Blind SQL Injection

Dans les environnements de production, les messages d'erreur SQL sont souvent supprimés pour éviter la divulgation d'informations. Dans ce cas, les attaquants s'appuient sur des techniques de **Blind SQL Injection**, qui infèrent des informations à partir des réponses comportementales de l'application.

La blind SQL injection démontre que même sans messages d'erreur visibles, les vulnérabilités d'injection SQL restent exploitables.

### Blind SQL Injection Boolean-Based

L'injection boolean-based exploite les réponses différentielles de l'application aux conditions vraies et fausses.

#### Méthodologie

Deux payloads de test ont été soumis pour établir une base de référence :

**Test 1 (Condition vraie) :**
```sql
1' AND 1=1 --
```
Résultat : L'application a affiché l'enregistrement utilisateur pour l'ID 1.

**Test 2 (Condition fausse) :**
```sql
1' AND 1=2 --
```
Résultat : L'application n'a retourné aucune donnée.

Cela confirme que la réponse de l'application varie en fonction de la valeur de vérité de la condition injectée.

#### Extraction de Données

Avec ce comportement établi, des questions spécifiques peuvent être posées à la base de données :

```sql
1' AND LENGTH(database())>5 --
```
→ Si des données sont retournées, le nom de la base de données fait plus de 5 caractères.

```sql
1' AND SUBSTRING(database(),1,1)='d' --
```
→ Si des données sont retournées, le premier caractère du nom de la base de données est 'd'.

Grâce à cette approche, les données peuvent être extraites caractère par caractère. Bien que l'exploitation manuelle soit chronophage, des outils automatisés comme `sqlmap` peuvent réaliser ce processus efficacement.

### Blind SQL Injection Time-Based

Si l'application produit des réponses identiques indépendamment du succès ou de l'échec de la requête, les attaquants peuvent utiliser des délais temporels pour inférer des informations.

#### Preuve de Concept

Le payload suivant introduit un délai de 5 secondes :

```sql
1' AND SLEEP(5) --
```

Si la page met 5 secondes à charger, la requête injectée a été exécutée avec succès.

#### Délais Temporels Conditionnels

L'injection time-based peut être combinée avec de la logique conditionnelle :

```sql
1' AND IF(LENGTH(database())>5, SLEEP(5), 0) --
```

- Si la condition est vraie, la réponse est retardée de 5 secondes.
- Si fausse, la réponse est immédiate.

Cette technique est très fiable mais plus lente que les méthodes boolean-based. De plus, l'utilisation répétée de `SLEEP()` peut déclencher la détection par des Web Application Firewalls (WAFs).

### Pourquoi la Blind SQL Injection est Importante

De nombreux développeurs supposent que la suppression des messages d'erreur SQL atténue les risques d'injection. Cependant, la blind SQL injection démontre que l'exploitation reste viable grâce à l'analyse comportementale.

Une validation correcte des entrées et des requêtes paramétrées sont nécessaires indépendamment des pratiques de gestion des erreurs.

---


## Impact Sécurité

Les vulnérabilités d'injection SQL permettent aux attaquants de contourner la logique applicative et d'interagir directement avec la base de données. Au niveau de sécurité faible, les scénarios d'attaque suivants sont possibles :

- **Exfiltration de données** : Dumps complets de la base de données incluant les credentials utilisateurs, e-mails et données applicatives sensibles
- **Bypass d'authentification** : Utilisation de payloads comme `' OR '1'='1` pour contourner les mécanismes de connexion
- **Manipulation de données** : Modification ou suppression non autorisée d'enregistrements
- **Élévation de privilèges** : Exploitation des permissions de la base de données pour obtenir un accès élevé au sein de l'application
- **Exécution de commandes système** : Dans certaines configurations (ex. MSSQL avec `xp_cmdshell`), les attaquants peuvent exécuter des commandes système arbitraires

L'injection SQL est classée **Injection (#3)** dans l'OWASP Top 10 2021 et reste l'une des vulnérabilités web les plus impactantes.

---


## Analyse des Causes Racines

La vulnérabilité existe car :

1. **Concaténation directe de chaînes** : La saisie utilisateur est intégrée directement dans les requêtes SQL sans sanitisation.
2. **Absence de requêtes paramétrées** : L'application n'utilise pas de prepared statements pour séparer la logique SQL des données.
3. **Validation insuffisante des entrées** : Aucune vérification de type ni validation n'est effectuée sur les données fournies par l'utilisateur.
4. **Exposition des messages d'erreur** : Les détails des erreurs SQL sont affichés au client, facilitant l'exploitation.

L'application part du principe que la saisie utilisateur est digne de confiance, ce qui constitue une violation fondamentale de la sécurité.

---



## Remédiation

Les stratégies d'atténuation incluent :

- Requêtes paramétrées / prepared statements
- Validation des entrées
- Limitation des privilèges de la base de données
- Désactivation des messages d'erreur détaillés

---



## Conclusion

Les vulnérabilités d'injection SQL démontrent comment une gestion inadéquate des entrées peut mener à une compromission complète de la base de données. Contrairement aux attaques côté client comme le XSS, l'injection SQL cible directement la couche de données de l'application, permettant un accès, une modification et une extraction non autorisés d'informations sensibles.

Cette analyse a couvert quatre techniques d'exploitation principales :
- **Injection error-based** : Exploitation des messages d'erreur exposés pour affiner les payloads
- **Injection boolean-based** : Manipulation de la logique de requête pour bypasser l'authentification et récupérer des données
- **Injection UNION-based** : Combinaison de requêtes pour une exfiltration structurée de données
- **Blind injection** : Inférence de données par analyse comportementale quand les erreurs sont supprimées

L'enseignement le plus critique est que **l'échappement des entrées utilisateur est insuffisant**. Seules les requêtes paramétrées (prepared statements) offrent une protection fiable en assurant une séparation stricte entre le code SQL et les données fournies par l'utilisateur.

Une défense efficace requiert plusieurs couches : les prepared statements comme contrôle principal, la validation des entrées comme mesure complémentaire, des comptes de base de données avec le minimum de privilèges pour limiter l'impact, et une gestion appropriée des erreurs pour prévenir la divulgation d'informations.
