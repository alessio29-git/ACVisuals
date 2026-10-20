/* GitHub Pages affiche 404.html pour n'importe quelle adresse introuvable
   (ex. /acvisuals/dossier/page-qui-n-existe-pas). On fixe donc la base des liens
   pour que styles, images et liens fonctionnent quel que soit le chemin.
   En local (fichier ouvert depuis l'ordinateur), on ne touche à rien. */
// (Le fichier est appelé deux fois dans 404.html : une fois en chemin absolu pour GitHub,
//  une fois en chemin relatif pour l'ordinateur. Le test évite d'ajouter la base deux fois.)
if (window.location.protocol !== 'file:' && !document.querySelector('base')) {
  document.write('<base href="/acvisuals/">');
}
