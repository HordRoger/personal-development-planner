# Piano di miglioramento team

Webapp statica per visualizzare e modificare il piano di miglioramento personale dei membri del team.

## Avvio

Apri `index.html` nel browser. I dati vengono salvati automaticamente nel browser e sincronizzati con Supabase quando la configurazione cloud e' disponibile.

## Uso da altri dispositivi

### Rete locale

Se l'altro dispositivo e' sulla stessa rete del PC:

```bash
node serve-local.js
```

Apri dal secondo dispositivo l'indirizzo mostrato come `Planner disponibile in rete locale`.

### Pubblicazione web

Il progetto e' pronto per GitHub Pages. Dopo il push su GitHub:

1. Apri il repository su GitHub.
2. Vai in `Settings` > `Pages`.
3. In `Build and deployment`, seleziona `Deploy from a branch`.
4. Seleziona branch `main` e cartella `/(root)`.
5. Salva e apri l'URL pubblicato da GitHub Pages.

Nota: GitHub Pages e' incluso gratis sui repository pubblici. Per repository privati puo' richiedere un piano GitHub a pagamento.

## Sincronizzazione Supabase

Per mantenere gli stessi dati su dispositivi diversi:

1. Crea un progetto su Supabase.
2. Apri l'editor SQL di Supabase e incolla il contenuto di `supabase-schema.sql`.
3. Esegui lo script SQL.
4. Apri `supabase-config.js` e compila:
   - `url`: Project URL Supabase;
   - `anonKey`: chiave publishable/anon pubblica;
   - `workspaceId`: lo stesso valore presente in `supabase-schema.sql`.

Quando questi valori sono presenti, la webapp carica lo stato da Supabase e salva ogni modifica nel cloud. Se Supabase non e' configurato o non e' raggiungibile, continua a funzionare con il salvataggio locale del browser.

## Funzioni incluse

- creazione e selezione dei membri del team;
- sidebar sinistra con profilo membro;
- sidebar sinistra e toolbox destra nascondibili;
- griglia centrale con righe per obiettivo e colonne settimanali con numerazione calendario;
- linee obiettivo con cerchi criterio configurabili;
- popup obiettivo aperto dal cerchio criterio selezionato;
- drag and drop dalla sidebar destra verso la griglia;
- snap degli estremi linea e dei criteri sulle settimane;
- sidebar destra con tool di creazione;
- timeline annuale scrollabile con tasto per tornare alla settimana corrente;
- salvataggio locale e sincronizzazione cloud opzionale con Supabase.

## Crediti icone

- Le icone usate dall'app sono i file locali `open-padlock.png` e `padlock.png`.
- Open lock icons created by Freepik - Flaticon: https://www.flaticon.com/free-icons/open-lock
- Padlock icons created by Freepik - Flaticon: https://www.flaticon.com/free-icons/padlock
