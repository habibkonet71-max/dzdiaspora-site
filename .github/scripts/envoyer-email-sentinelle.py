#!/usr/bin/env python3
import os, smtplib
from email.mime.text import MIMEText

EXPEDITEUR = "habib.k.onet71@gmail.com"
DESTINATAIRE = "kourrak.habib@hotmail.com"


def main():
    sujet = os.environ["SENTINELLE_SUJET"]
    corps = os.environ["SENTINELLE_CORPS"]
    mot_de_passe = os.environ["GMAIL_APP_PASSWORD_SENTINELLE"]

    message = MIMEText(corps)
    message["Subject"] = sujet
    message["From"] = f"DZ Diaspora Site <{EXPEDITEUR}>"
    message["To"] = DESTINATAIRE

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as serveur:
        serveur.login(EXPEDITEUR, mot_de_passe)
        serveur.sendmail(EXPEDITEUR, [DESTINATAIRE], message.as_string())

    print(f"Email envoye a {DESTINATAIRE}")


if __name__ == "__main__":
    main()
