# XSS - De l'Injection à l'Impact Réel (DVWA)

## Contexte
Ce writeup documente la découverte et l'exploitation de vulnérabilités Cross-Site Scripting (XSS) dans une application web volontairement vulnérable (DVWA).

L'objectif ici n'est pas seulement de déclencher une exécution JavaScript, mais de comprendre :
- Pourquoi la vulnérabilité existe
- Comment elle peut être exploitée dans des scénarios réels
- Quels mécanismes de sécurité sont nécessaires pour la corriger

### Environnement
- Application : Damn Vulnerable Web Application (DVWA)
- Déploiement : Docker
- Niveau de sécurité : Faible
- OS cible : Linux

Lors du déploiement initial, une erreur d'authentification à la base de données s'est produite en raison
d'un volume MariaDB précédemment initialisé avec des credentials incompatibles.
Le problème a été résolu en supprimant les volumes persistants et en réinitialisant la base de données.


## XSS Réfléchi - Analyse de la Vulnérabilité

La vulnérabilité XSS réfléchi se produit car la saisie contrôlée par l'utilisateur est directement intégrée dans la réponse HTML sans aucune sanitisation ni encodage de sortie.

Dans le module XSS réfléchi de DVWA, l'application récupère un paramètre GET et le renvoie à la page :

```php
$name = $_GET['name'];
echo "Hello $name";
```

### Preuve de Concept

Pour valider la vulnérabilité, le payload suivant a été injecté dans le paramètre vulnérable :

```html
<script>alert(1)</script>
```

Ce payload démontre que le code JavaScript injecté est interprété et exécuté par le navigateur de la victime.



## Le Rôle du DOM dans l'Exploitation XSS

Le Document Object Model (DOM) représente la structure interne d'une page web telle qu'elle est interprétée par le navigateur. Il expose tous les éléments de la page comme des objets accessibles via JavaScript.

Lorsqu'une vulnérabilité Cross-Site Scripting est exploitée, le code JavaScript injecté s'exécute avec un accès complet au DOM de l'application de confiance. Cela permet à un attaquant de lire, modifier ou manipuler dynamiquement le contenu de la page tel que vu par la victime.

Dans le contexte DVWA, la manipulation du DOM démontre comment le XSS va au-delà de la simple exécution JavaScript et permet un contrôle complet côté client.


---

## Impact Réel : Exposition de Session

Une fois l'exécution JavaScript obtenue, l'attaquant accède au contexte navigateur de la victime. Cela inclut les cookies de session utilisés pour l'authentification.

Dans DVWA, les cookies de session sont accessibles via JavaScript, permettant le payload suivant :

```html
<script>alert(document.cookie)</script>
```

Cela démontre que des données d'authentification sensibles peuvent être exposées, permettant potentiellement le vol de session.



Au-delà de l'exposition de données, le XSS permet une manipulation complète de l'interface utilisateur.
Un attaquant peut modifier dynamiquement le contenu de la page, afficher de faux formulaires, ou induire les utilisateurs en erreur pour qu'ils effectuent des actions non souhaitées.



## XSS Stocké - Compromission Client-Side Persistante

Contrairement au XSS réfléchi, les vulnérabilités XSS stocké impliquent que la saisie malveillante est stockée de façon permanente sur le serveur (ex. dans une base de données) et servie aux utilisateurs à chaque chargement de la page affectée.

Dans le module XSS stocké de DVWA, la saisie utilisateur est stockée sans validation ni encodage de sortie, permettant une exécution JavaScript persistante entre les sessions.

Cela augmente considérablement l'impact, car tout utilisateur visitant la page exécutera automatiquement le payload de l'attaquant.

Les vulnérabilités XSS stocké sont particulièrement dangereuses car elles ne nécessitent aucune interaction utilisateur au-delà de la visite de la page affectée. Elles constituent donc des vecteurs d'attaque fiables pour le vol de session, le phishing et la compromission client-side à grande échelle.

---

## Mesures de Protection

### Protections Inefficaces

Les approches naïves de filtrage des entrées, comme la blacklist de balises ou de mots-clés spécifiques, sont insuffisantes pour prévenir le XSS. Les attaquants peuvent contourner ces filtres grâce à des éléments HTML alternatifs, des gestionnaires d'événements ou des techniques d'encodage.


### Encodage de Sortie Approprié

La défense la plus efficace contre le XSS est l'encodage de sortie adapté au contexte.
Les données contrôlées par l'utilisateur ne doivent jamais être intégrées directement dans les réponses HTML sans échappement approprié.

En PHP, des fonctions comme `htmlspecialchars()` empêchent que le code injecté soit interprété par un navigateur.


### Cookies HttpOnly

Marquer les cookies de session comme HttpOnly empêche leur accès via JavaScript, réduisant le risque de vol de session. Cependant, HttpOnly ne prévient pas le XSS lui-même et doit être considéré comme une mesure de défense en profondeur.


### Content Security Policy (CSP)

Une Content Security Policy correctement configurée réduit considérablement l'impact des vulnérabilités XSS en restreignant les sources depuis lesquelles les scripts peuvent être chargés et en désactivant l'exécution de scripts inline.

Même lorsqu'un point d'injection existe, la CSP peut empêcher l'exploitation.

---

## Conclusion

Les vulnérabilités Cross-Site Scripting démontrent comment des failles côté client peuvent avoir des implications sécuritaires critiques. Bien que l'exécution JavaScript puisse sembler anodine, l'accès au contexte navigateur permet le vol de session, la manipulation de l'utilisateur et une exploitation à grande échelle.

Une mitigation efficace requiert une approche de défense en profondeur combinant un encodage de sortie approprié, des attributs de cookies sécurisés, et des protections navigateur modernes comme la Content Security Policy.
