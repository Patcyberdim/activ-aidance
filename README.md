# Blog — Eleventy + Decap CMS + Netlify

Site statique (Eleventy) avec une interface d'écriture simple (Decap CMS) sur `/admin/`.

## Structure

| Élément | Où |
|---|---|
| Articles (Markdown) | `src/articles/` |
| Page « À propos » | `src/a-propos.md` |
| Nom du blog, slogan, message du pied de page | `src/_data/site.json` |
| Gabarits (pages, article, carte) | `src/_includes/` |
| Styles / scripts | `src/css/style.css`, `src/js/` |
| Interface d'écriture | `src/admin/config.yml` |

Chaque article a : titre, date, **thème** (liste fixe), **tags** (libres), résumé, image, liens « Pour aller plus loin » (tous facultatifs sauf titre, date, thème).

Pour changer la liste des thèmes, modifier les `options` du champ « Thème » **et** les `view_filters` dans `src/admin/config.yml`.

## Tester en local

```bash
npm install
npm start          # site sur http://localhost:8090
npm run cms        # (autre terminal) permet d'utiliser /admin sans GitHub
```

Puis ouvrir http://localhost:8090/admin/ : les articles écrits sont enregistrés directement dans `src/articles/`.

## Changer le style du site

Six styles sont disponibles dans `src/css/themes/` : `defaut`, `blanc`, `blanc-arrondi`, `pastel`, `moderne`, `joyeux`.

- **Comparer** : avec `npm start` (ou `lancer-site.bat`), une barre « Aperçu du style » s'affiche en bas de page. Elle n'existe jamais sur le site en ligne.
- **Choisir** : mettre le nom du style dans `"theme"` de `src/_data/site.json`, ou le choisir dans « Réglages du site » de l'administration.

## Test rapide sur Netlify (glisser-déposer, sans GitHub)

1. Double-cliquer sur `preparer-netlify.bat` : il construit le site et crée `activ-aidance-netlify.zip`.
2. Glisser ce zip sur https://app.netlify.com/drop.
3. Netlify donne une adresse `xxxx.netlify.app`. La saisir dans `"url"` de `src/_data/site.json`, relancer le `.bat` et déposer le nouveau zip (pour les aperçus Facebook).

Limites : l'administration `/admin/` ne fonctionne pas dans ce mode (il faut la mise en ligne via GitHub, ci-dessous), et chaque modification demande de redéposer un zip. Le site est masqué des moteurs de recherche (`"noindex": true` dans `site.json`) : le passer à `false` au lancement officiel.

## Mise en ligne sur Netlify (avec GitHub et l'administration)

1. Créer un dépôt GitHub (privé ou public) et y envoyer ce dossier (`git init`, `git add .`, `git commit`, `git push`).
2. Sur Netlify : *Add new site → Import from Git*, choisir le dépôt. Les réglages sont lus dans `netlify.toml`.
3. Dans `src/admin/config.yml`, `repo:` et les adresses du site sont déjà renseignés (`Patcyberdim/activ-aidance`, `activ-aidance.netlify.app`) ; les adapter si le compte ou le nom du site change.
4. Activer la connexion à l'administration :
   - GitHub → *Settings → Developer settings → OAuth Apps → New OAuth App*. Homepage : l'adresse du site. Callback : `https://api.netlify.com/auth/done`.
   - Netlify → *Site configuration → Access & security → OAuth → Install provider → GitHub*, puis coller le *Client ID* et le *Client Secret*.
5. Le père se connecte sur `https://adresse-du-site/admin/` avec un compte GitHub **ayant accès en écriture au dépôt** (à ajouter comme collaborateur).

Chaque clic sur « Publier » enregistre l'article dans GitHub, et Netlify republie le site en 1 à 2 minutes.

## Avant la mise en ligne publique

- Supprimer les 4 articles « Article d'exemple » (depuis `/admin/` ou dans `src/articles/`).
- Remplacer le contact (`mailto:contact@exemple.fr`) par le vrai.
- Ajouter une page de **mentions légales** et une **politique de confidentialité** (obligatoires en France), notamment avant d'ajouter des statistiques ou un bandeau cookies. Le site actuel ne dépose aucun cookie.
