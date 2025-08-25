import re
import unicodedata


class SlugService:

    def slugify(self, text: str) -> str:
        # Normalise les accents (é -> e, ü -> u, etc.)
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('utf-8')

        # Met en minuscule
        text = text.lower()

        # Remplace tout ce qui n’est pas alphanumérique par un espace
        text = re.sub(r'[^a-z0-9]+', '-', text)

        # Supprime les tirets multiples
        text = re.sub(r'-+', '-', text)

        # Supprime les tirets au début et à la fin
        text = text.strip('-')

        return text