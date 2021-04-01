# EventModelingWorkshopPL | GitHubClone
Opracowanie: Mateusz Nowak (ZycieNaKodach.pl)

Szkolenie głównie skupione na technikach takich jak Event Storming, Event Modeling i Domain-Driven Design.
Sam brałem nie raz udział w takich szkoleniach, ale żadne nie było jeszcze tak kompleksowe, aby prowadziło od fazy designu i karteczek na ścianie (teraz Miro) aż do działającego kodu.
Kod startowy będzie dostępny w C# (.NET Core) / Kotlin (Spring) / TypeScript (Express). Wszystko zintegrowane poprzez EventStoreDB.

UWAGA! 
Kod ma najmniej abstrakcji jak tylko to możliwe, co nie jest najlepszą praktyką programistczyną w kontekście rozszerzalności.
Jednakże ułatwi to zrozumienie co się dzieje, już w trakcie warsztatów.


W trakcie szkolenia dowiesz się wielu rzeczy i zastosujesz je w praktyce:
- Zobaczysz co to Bounded Context i jak stosować zasady SOLID na poziomie architektury
- Odkryjesz działanie omawianej domeny za pomocą Event Stormingu
- Wykonasz design systemu z użyciem Event Modelingu (na jakiej zasadzie wyznaczać mikroserwisy czy modularny monolit)
- Zobaczysz jak te praktyki pomagają zaplanować pracę i podzielić zadania
- Zaplanujesz rozszerzalną architekturę systemu i zobaczysz zależności między komponentami
- Wykonasz części systemu z wykorzystaniem Event Sourcingu i zastosujesz EventStore (zobaczysz jakie to proste z Event Modelingiem)
- Otrzymasz materiały do dalszego własnego rozwoju poznanych umiejętności

Techniki Domain-Driven Design naturalnie wpasowują się w EventModeling.
Nie będziemy się skupiać na DDD, które przyjdzie naturalnie.


## Pobranie repozytorium

`git clone https://github.com/nowakprojects/EventModelingGitHubClone.git`

## Uruchomienie serwisów

###Lokalnie
**UWAGA! Dużo osób zgłaszało problemy z uruchominiem poprzez docker-compose, więc zalecana jest ta instrukcja z uruchomieniem lokalnym.**

Do wykonania ćwiczeń praktycznych, jeśli dysponujesz odpowiednim środowiskiem - najlepiej uruchomić:
- (WYMAGANE) EventStore (Docker). W głównym katalogu wykonaj:
  `docker-compose -f docker-compose.eventstore.yaml up`
- (WYMAGANE) Frontend. 
  - W katalogu `frontend` na początek zależnie od tego, w jakim środowisku chcesz wykonywać zadania zmień nazwę pliku env z odpowiednim postfixem na `env.local`.
  - W katalogu `frontend` wykonaj kolejno:
    - `npm install`
    - `npm run start`
- (WYMAGANE) Backend NodeJS.
  - Uruchom wg. swojego ulubionego sposobu LUB:
  - W katalogu`backend-nodejs` wykonaj kolejno:
    - `npm install`
    - `npm run start:dev`
- (OPCJONALNE - wybierz jedno) Backend .NET Core.
  - Uruchom wg. swojego ulubionego sposobu LUB:
  - W katalogu `backend-dotnet/EventModelingGitHubCloneDotNet/EventModelingGitHubCloneDotNet` wykonaj kolejno:
    - `dotnet restore`
    - `dotnet run`
- (OPCJONALNE - wybierz jedno) Backend Kotlin
  - Uruchom wg. swojego ulubionego sposobu LUB:
    - W katalogu `backend-kotlin` wykonaj kolejno:
      - `./gradlew build`
      - `./gradlew bootRun`
  

### W trybie reagowania na zmiany (developerski)
Repozytorium zostało przygotowane w taki sposób, 
abyś mógł uruchomić projekty i wprowadzać zmiany bez posiadania zainstalowanych środowisk dla wszystkich języków programowania.

To, co jest wymagane to Docker Compose.
Jedynie zmiany bibliotek niosą za sobą potrzebę przebudowania aplikacji:

`docker-compose -f docker-compose.dev.yaml build`

Później już wystarczy uruchamiać tylko poprzez:

`docker-compose -f docker-compose.dev.yaml up`


### W trybie builda (bez reagowania na zmiany)
W tym przypadku wszelkie zmiany kodu czy nawet zmiennych środowiskowych wymagają przebudowania docker-compose.
Odkomentuj z pliku docker-compose.build.yaml serwisy, na których będziesz chciał pracować i uruchom je lokalnie.

`docker-compose -f docker-compose.build.yaml build`

Później już wystarczy uruchamiać tylko poprzez:

`docker-compose -f docker-compose.build.yaml up`


### Uruchomione aplikacje

Aplikacje uruchomione poprzez docker-compose, nie różnią się niczym od uruchomienia poszczególnych serwisów lokalnie.
Więc jeśli chcesz uruchomić coś lokalnie dla lepszego developer experience, to po prostu zakomentuj odpowiedni serwis w `docker-compose.yaml`
Po uruchomieniu będą dostępne następujące serwisy:

- Frontend:     http://localhost:3000/ZycieNaKodach/EventModelingRepo/pulls
- Backend NodeJS:       http://localhost:4000/swagger/
- Backend .NET:         http://localhost:5000/swagger/index.html
- Backend Kotlin:       http://localhost:7000/swagger-ui/
- EventStore:   http://localhost:2113/  (user: admin   password: changeit)

Upewnij się, że każdy z tych adresów odpowiada. Zależnie od tego czy wybrałeś .NET czy Kotlina. 
Jeśli chcesz pisać w NodeJS wystarczy Ci sam Node.
Najdłużej trwa uruchomienie serwisu w Koltinie. W logach docker-compose powinieneś zobaczyć:
`eventmodeling-backend-kotlin    | 2021-04-01 09:29:39.922  INFO 447 --- [  restartedMain] p.z.e.g.GitHubCloneApplicationKt         : Started GitHubCloneApplicationKt in 12.168 seconds (JVM running for 12.987)`

Kod poszczególnych wersji backendu nie realizuje dokładnie tego samego, dlaczego tak jest, dowiesz się w trakcie szkolenia.

## Przygotowanie | Wymagania
Aby skorzystać jak najwięcej ze szkolenia, musimy zbudować wspólne zrozumienie niektórych koncepcji.
Przed szkoleniem dobrze zapoznać się z linkami poniżej.

- I część - projektowanie / modelowanie (3 godziny)
  - What is Event Modeling | https://eventmodeling.org/posts/what-is-event-modeling/
  - EVENTSTORMING i 4 poziomy zdarzeń | https://www.youtube.com/watch?v=31PNdWaUrTY&feature=youtu.be
  
- II część - implementacja (kolejne 3 godziny)
  - A Functional Foundation for CQRS/ES | https://verraes.net/2014/05/functional-foundation-for-cqrs-event-sourcing/
  - Zobacz co to EventSourcing:
    - https://www.eventstore.com/blog/what-is-event-sourcing
    - https://www.eventstore.com/blog/convincing-your-cto
  - Zapoznaj się krótko z EventStoreDB:
    - https://developers.eventstore.com/clients/grpc/getting-started/#connection-details

-----------

## Agenda

Komunikacja w trakcie warsztatów:
- Wszyscy: Kanał Slack
- Głównie spotkanie: VBC
- Zespół 1: Google Meet
- Zespół 2: Google Meet

### Część I - Projektowanie i modelowanie
  

#### Rozpoczęcie (30 min.)
- 5 min.    |   Przywitanie i zapoznanie z MIRO Board
- 15 min.   |   Wstęp do Bounded Contextu i EventStormingu.
  - Przykłady kodu
  - Porównania przedstawiające sens stosowania BC
  - Inne metody modelowania jak UML
  - Szybkie ćwiczenie na EventStorming.
  
#### Event Storming — Praktyka w zespołach (60 min.)
- 15 min. | EventStorming w MIRO - wprowadzenie
  - Omówienie notacji
  - Przykład modelowania
- 5 min.  | Podział na zespoły
- 20 min. | Praca w zespołach nad domeną GitHub (cz. 1)
- 10 min. | Spotkanie wszystkich - pytania / wątpliwości
- 20 min. | Praca w zespołach nad domeną GitHub (cz. 2 - kontynuacja)

#### PRZERWA - 15 minut

#### Event Modeling - praktyka w zespołach (90 min.)
- 20 min. | EventModeling - wprowadzenie do praktyki
  - Różnica między EventStormingiem
  - Przykład modelowania na MIRO
  - Przejście z ES do EM
  - Wyznaczanie SLICE - dlaczego to takie ważne
  
- 5 min. | Rozejście się do zespołów
- 20 min. | Praca w zespołach nad EventModelingiem
- 15 min. | Spotkanie wszystkich - pytania / wątpliwości
- 30 min. | Kontynuacja pracy nad EventModelingiem

---

### KONIEC CZ. 1 - PRZERWA DO 13.00 - ok godziny (OBIAD) - Czas na luźne Q&A
Dobrze w tym czasie upewnić się, że każdemu działa środowisko do implementacji.

---

### Część II - Implementacja modelu

#### Programowanie - wprowadzenie (~ 1 godz.)
- 45 min. | Od karteczek do implementacji - EventModeling
  - Przejście przez przygotowany kod
    - Dopisanie nowego kawałka
  - Jak dzielić na slice i zadania
  - Co to jest EventSourcing. Dlaczego to pomaga?
  - Jak działa EventStore i dlaczego właśnie ta technologia?
  
#### Programowanie w parach / zespołach (~ 2 godz.)
- 45 min. | Programowanie w zespołach
- 15 min. | CatchUp - problemy / pytania
- 45 min. | Programowanie w zespołach
- 15 min. | Zakończenie i materiały do dalszego rozwoju

>>>>>>>>>> KONIEC


##### Kilka przydatnych linków
- EventModeling a Bakery
  https://www.youtube.com/watch?v=DhZBQWO34Pw
  
- EventModelingTimeTrackingSystemMeetUp
  https://www.youtube.com/watch?v=DwC0rRzSVww&t=705s

- EventModeling Slack:
  https://join.slack.com/t/eventmodeling/shared_invite/zt-94a7pu2e-ZWg~uPFGxB5I0GB~be664w

- Event Modeling with Adam Dymitruk
  https://www.youtube.com/watch?v=jhybUa0_2eI

- Event Modeling Deep Dive with Vaughn Vernon and Adam Dymitruk
  https://www.youtube.com/watch?v=ufKgwjsD1l8

- EventDriven Podcast (Episode 5 - Vaughn Vernon on DDD/CQRS/ES)
  https://www.youtube.com/watch?v=PCgbeb8qPys

Examples:
- https://github.com/fraktalio/restaurant-demo
- https://github.com/fraktalio/order-demo
- https://github.com/fraktalio/courier-demo

MIRO BOARDS:
https://miro.com/app/board/o9J_ktrevAQ=/
https://miro.com/app/board/o9J_kwc8qR0=/

Workshop - Cinema:
https://miro.com/app/board/o9J_ktTXNi0=/
https://miro.com/app/board/o9J_krOfkGM=/
https://miro.com/app/board/o9J_krimJVY=/

Examples:
https://github.com/eventmodeling/eventdriventhinking
