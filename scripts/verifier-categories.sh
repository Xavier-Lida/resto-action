#!/usr/bin/env bash
# Ouvre les portails de catégorisation des filtres d'entreprise pour un domaine.
#
# POURQUOI UN SCRIPT ET PAS UN APPEL D'API : ces portails rendent leur résultat
# en JavaScript derrière un captcha, délibérément — ils ne veulent pas qu'on
# teste en boucle si un domaine est détecté. Il n'y a donc rien à automatiser
# au-delà de l'ouverture des onglets. Le script fait le transport, tu fais la
# lecture.
#
#   ./scripts/verifier-categories.sh                 # les 4 domaines, un par un
#   ./scripts/verifier-categories.sh matchify.ca     # un seul

set -euo pipefail

DOMAINES=("${@:-}")
if [[ -z "${DOMAINES[0]}" ]]; then
  DOMAINES=(restoaction.ca matchify.ca octopusugc.com studioslt.com)
fi

# Portails qui acceptent le domaine dans l'URL : ouverts pré-remplis.
prerempli() {
  local d="$1"
  echo "https://talosintelligence.com/reputation_center/lookup?search=${d}"
  echo "https://www.fortiguard.com/webfilter?q=${d}"
  echo "https://transparencyreport.google.com/safe-browsing/search?url=${d}"
}

# Portails à formulaire seulement : le domaine est dans le presse-papiers.
formulaire() {
  echo "https://urlfiltering.paloaltonetworks.com/"
  echo "https://sitereview.bluecoat.com/"
  echo "https://global.sitesafety.trendmicro.com/"
  echo "https://sitereview.zscaler.com/"
}

for d in "${DOMAINES[@]}"; do
  printf '\n\033[1m=== %s ===\033[0m\n' "$d"
  printf '%s' "$d" | pbcopy
  echo "  → « $d » copié dans le presse-papiers (⌘V dans les formulaires)"
  echo "  → 3 onglets pré-remplis + 4 à coller"

  while read -r u; do [[ -n "$u" ]] && open "$u"; done < <(prerempli "$d")
  while read -r u; do [[ -n "$u" ]] && open "$u"; done < <(formulaire)

  echo
  echo "  Note la catégorie annoncée par chacun, puis Entrée pour le domaine suivant."
  read -r </dev/tty
done

printf '\n\033[1mTerminé.\033[0m Les catégories relevées vont dans la fiche de reclassement.\n'
