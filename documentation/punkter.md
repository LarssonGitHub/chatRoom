{\rtf1\ansi\ansicpg1252\deff0\nouicompat\deflang1053{\fonttbl{\f0\fnil\fcharset0 Calibri;}}
{\*\generator Riched20 10.0.19041}\viewkind4\uc1 
\pard\sa200\sl240\slmult1\f0\fs22\lang29\par
\par
meaningen med appen:\par
en app d\'e4r folk kan chatta och rita med varandra.\par
\par
uppbyggnad:\par
ejs, websockets, express, session,  mongoose och database\par
\par
hur appen utf\'f6r:\par
mycket sortering med t.ex. typer, b\'e5de p\'e5 klientsidan och serversidan \b (mESSAGE VALIDATION) \b0 n\'e4r ett websocket p\'e5 serversidan motar ett medelande delar den upp det i mindre bitar d\'e4r dessa valideras, och om allt blir godk\'e4nt sparas det till databsen f\'f6r  och skickas tillbaka till websocket p\'e5 klintsidan\par
\par
errorhandling:\par
routes:\par
anv\'e4der routes och sessions f\'f6r att h\'e5lla anv\'e4daren till websocket i shack\par
server:\par
en stor del har varit att hantera fel, b\'e5de fr\'e5n serverh\'e5llet och anv\'e4daren som tidiagre n\'e4mnde validations och asykronisk prat med databasen s\'e5 har jag ocks\'e5 lagt till ett hinder s\'e5 anv\'e4daren inte kan f\'f6rst\'f6ra min server. (visa)\par
klient:\par
samma g\'e4ller f\'f6r klintsidan, t.ex. fetch och \'e5terigen valdiering.\par
\par
features:\par
login och registering\par
appen \'e4r i f\'f6rsta hand designad f\'f6r mobil, och ja, canvas \'e4r responsiv och fungerar p\'e5 telefon,\par
canvas har m\'e5nga funktioner, ett klassiskt ritprogram,\par
anv\'e4daren kan best\'e4mma sj\'e4lv om denna vill spara bilden eller inte\par
vi kan ocks\'e5 se vilka bilder som har submittats \par
alla loggar sparas dock autmatosikt till databasen och kan laddas in med ett kanpptryck\par
vi kan se vilka som \'e4r online\par
tiden registreras\par
som ni m\'e4rkt, mr bot \'e4r h\'e4r.\par
\par
css:\par
tr\'e5kig, men pga att den inte \'e4r klar, har bara fokuserat p\'e5 en fungerade layout.\par
dock anv\'e4der jag en kombination av bootstrap och min egen kid, tillsammans med frontawesome som st\'e5r f\'f6r ikonerna.\par
den \'e4r responsiv, dock d\'e5 den \'e4r mobile first har jag inte designat en snygg layout f\'f6r st\'f6rre skr\'e4mar.\par

\pard\sa200\sl276\slmult1\par
}
 