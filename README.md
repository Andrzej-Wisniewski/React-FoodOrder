# **Aplikacja do zamawiania posiłków online**

##1. Cel i zakres projektu 

Celem projektu jest stworzenie aplikacji webowej, która umożliwia zamawianie posiłków online. Podstawowe funkcjonalności to:

*   Rejestracja i logowanie użytkowników
*   Przeglądanie listy dostępnych posiłków
*   Zarządzanie koszykiem (dodawanie, usuwanie, zmiana ilości)
*   Składanie zamówienia
*   Podstawowa obsługa płatności

W ramach projektu przewidziane jest zarówno stworzenie części backendowej (Node.js/Express, plik JSON) jak i frontendowej (React), a także integracja z potencjalnymi usługami zewnętrznymi (np. bramką płatniczą). 

##2. Analiza ryzyka 

| **Nr** | **Potencjalne zagrożenie** | **Skutki** |
|--|--|--|
| 1 | Brak wystarczającej wydajności serwera | Spadek szybkości działania aplikacji, możliwe przeciążenia przy większej liczbie zamówień, niezadowolenie użytkowników |
| 2 | Utrata/dostęp do danych osobowych klientów (wyciek danych) | Naruszenie RODO, utrata zaufania użytkowników, potencjalne kary finansowe, szkody wizerunkowe. |
| 3 | Niewłaściwe działanie systemu koszyka lub płatności | Brak możliwości dokonania zamówienia, utrata dochodów, niezadowolenie klientów, odpływ użytkowników do konkurencji. |
| 4 | Ataki typu SQL Injection lub XSS | Nieautoryzowany dostęp do bazy danych, kradzież danych, sabotaż (np. modyfikacja treści), duże zagrożenie reputacji. | 
| 5 | Przestoje serwera (np. awaria hostingu, problemy z siecią) | Niedostępność usługi, brak możliwości dokonywania zamówień, straty finansowe w piku zamówień (np. pora obiadowa). |
| 6 | Uzależnienie od darmowych narzędzi z ograniczonym wsparciem | Jeśli darmowe narzędzia przestaną być rozwijane, może to zablokować rozwój projektu lub wymusić kosztowną migrację. |
| 7 | Niewłaściwe wprowadzanie danych przez użytkowników (np. błędny adres, dane do wysyłki) | Niedoręczone zamówienia, skargi klientów, wzrost kosztów obsługi reklamacji, możliwe dodatkowe koszty logistyki. 

##3. Analiza dwóch istniejących rozwiązań na rynku

Aplikacja ma na celu umożliwić zamawianie posiłków online. Na rynku działają już popularne platformy – poniżej przedstawiono dwie z nich:

###3.1. Uber Eats

*   **Opis:** Platforma międzynarodowa obsługująca dostawy jedzenia z rozmaitych lokali; w Polsce bardzo popularna zwłaszcza w większych miastach.
*   **Zalety:**
    *   Szeroki zasięg, duży wybór restauracji.
    *   Zintegrowany system kurierów, śledzenie dostawy w czasie rzeczywistym.
    *   Rozpoznawalna marka w skali globalnej.
*   **Wady:**
    *   Wysokie prowizje dla restauracji i koszty dostawy.
    *   Brak indywidualnych modyfikacji aplikacji pod konkretną markę.

###3.2. Pyszne.pl

*   **Opis:** Polski serwis do zamawiania jedzenia online współpracujący z tysiącami restauracji; oferuje płatności online, kody rabatowe, oceny dań.
*   **Zalety:**
    *   Duża baza restauracji i rozbudowana sieć dostaw.
    *   Zaawansowane systemy płatności i promocji.
    *   Znana marka, wysokie zaufanie klientów.
*   **Wady:**
    *   Dla restauracji wysokie prowizje.
    *   Mniejsza elastyczność co do indywidualnych wdrożeń; obsługa ogranicza się do modelu platformy.
*   **Co w naszym rozwiązaniu będzie lepsze:**
    *   Pełna kontrola nad danymi użytkowników i interfejsem.
    *   Możliwość spersonalizowania oferty (rabatów, metod płatności) według potrzeb właściciela biznesu.
    *   Brak pośrednika pobierającego część zysków; restauracja (lub sieć) zarządza bezpośrednio aplikacją.

##4. Kosztorys 

| **Pozycja** | **Opis** | **Wariant minimalny** | **Wariant optymalny** | **Wariant maksymalny** |
|--|--|--|--|--|
| Hosting | Tanie VPS w chmurze vs. profesjonalny hosting | 0 zł (AWS Free Tier na 12 mies.) | 1 000 zł/rok | 5 000 zł/rok |
| Domena | Koszt rejestracji i utrzymania domeny | 50 zł/rok | 100 zł/rok | 300 zł/rok |
| Licencje oprogramowania | Visual Studio Code, MongoDB, Azure DevOps, itp. | 0 zł (wersje studenckie) | 2 000 zł/rok (Podstawowe wsparcie) | 5 000 zł/rok (Enterprise, wsparcie premium) |
| Koszt pracy | Wyliczenie na bazie 20 dni roboczych | 20 dni x 500 zł = 10 000 zł | 20 dni x 700 zł = 14 000 zł | 20 dni x 1 000 zł = 20 000 zł |
| Inne narzędzia | Płatne wtyczki do testów, CI/CD (np. GitHub Actions w planach płatnych) | 0 zł (darmowe limity) | 1 000 zł/rok | 3 000 zł/rok |

# **Cel i zakres projektu** 

Celem projektu jest stworzenie aplikacji webowej, która umożliwia zamawianie posiłków online. Podstawowe funkcjonalności to:

- Rejestracja i logowanie użytkowników
- Przeglądanie listy dostępnych posiłków
- Zarządzanie koszykiem (dodawanie, usuwanie, zmiana ilości)
- Składanie zamówienia
- Podstawowa obsługa płatności

W ramach projektu przewidziane jest zarówno stworzenie części backendowej (Node.js/Express, plik JSON) jak i frontendowej (React), a także integracja z potencjalnymi usługami zewnętrznymi (bramką płatniczą, system powiadomień). 

------------------
# **Analiza Wymagań**

## a) Wymagania funkcjonalne

| Nazwa | Priorytet | Kryteria akceptacji |
| --- | --- | --- |
| Rejestracja użytkownika | Wysoki | Użytkownik może założyć konto podając email, hasło, imię i nazwisko. System wysyła email potwierdzający. |
| Logowanie | Wysoki | Użytkownik może się zalogować podając poprawne dane. Nieudane logowanie zwraca komunikat błędu. |
| Przeglądanie listy posiłków | Wysoki | System wyświetla listę dostępnych posiłków z opisem i ceną. |
| Zarządzanie koszykiem | Wysoki | Użytkownik może dodać, usuwać posiłki do koszyka, zmieniać ilość i usuwać. |
| Składanie zamówienia | Wysoki | Użytkownik może sfinalizować zamówienie wybierając metodę płatności. |
| Obsługa płatności | Wysoki | System integruje się z bramką płatniczą, obsługuje płatność online. |
| Powiadomienia o statusie zamówienia | Średni | Użytkownik otrzymuje powiadomienie o statusie zamówienia. |
| System ocen i recenzji | Średni | Użytkownicy mogą oceniać i komentować posiłki. |
| Historia zamówień | Średni | Użytkownik ma dostęp do listy poprzednich zamówień. |
| Zarządzanie menu restauracji | Wysoki | Administrator może dodawać, edytować i usuwać pozycje menu. |
| Obsługa zwrotów i reklamacji | Średni | System umożliwia zgłaszanie reklamacji i zwrotów. |
| Generowanie raportów sprzedaży | Średni | Administrator może generować raporty sprzedaży. |
| Obsługa promocji i kodów rabatowych | Średni | System obsługuje rabaty i promocje. |
| Integracja z mapą dostaw | Średni | Możliwość śledzenia dostawy na mapie. |
| Panel administracyjny | Wysoki | Administrator zarządza użytkownikami i zamówieniami. |

## b) Wymagania niefunkcjonalne

| Nazwa | Priorytet | Kryteria akceptacji |
| --- | --- | --- |
| Wydajność | Wysoki | System obsługuje 1000 użytkowników jednocześnie bez zauważalnych opóźnień. |
| Skalowalność | Wysoki | Możliwość dodania nowych serwerów w celu obsługi większego ruchu. |
| Bezpieczeństwo | Wysoki | Szyfrowane dane, ochrona przed SQL Injection lub XSS. |
| Dostępność | Wysoki | System dostępny 99.9% czasu, nie licząc przerw technicznych. |
| Obsługa błędów | Średni | Użytkownik otrzymuje czytelne komunikaty o błędach. |
| Kompatybilność | Średni | Aplikacja działa na najpopularniejszych przeglądarkach i systemach mobilnych. |
| Łatwość użycia | Średni | Intuicyjny interfejs dla użytkowników. |
| Czas odpowiedzi | Wysoki | Strona ładuje się w czasie krótszym niż 2 sekundy. |
| Przetwarzanie płatności | Wysoki | Integracja z bezpiecznymi systemami płatności. |
| Kopie zapasowe | Średni | System codziennie wykonuje kopię bazy danych. |

--------------------------------
# **Opis aktorów i ról w systemie**

| Aktor | Opis |
| --- | --- |
| Użytkownik| Osoba zamawiająca posiłki. Może rejestrować się, przeglądać menu, składać zamówienia. |
| Administrator | Osoba zarządzająca restauracją. Ma dostęp do panelu administracyjnego, zarządza menu i zamówieniami. |
| Kurier | Osoba dostarczająca zamówienia do klientów. |
| System płatności | Zewnętrzny system do przetwarzania transakcji. |
| System powiadomień | Moduł wysyłający powiadomienia do użytkowników. |

![image.png](.attachments/image-55402207-6ea3-4528-8b61-4c8aea3d0aaa.png)

Powyższy diagram przedstawia interakcje użytkownika z systemem zamówień.

![image.png](.attachments/image-3f74a779-b24b-41ee-b2c6-1ef3dc17ac74.png)

Powyższy diagram przedstawia zadania administratora w systemie zamówień.

![image.png](.attachments/image-c6982cb6-25a8-4cf1-8626-05b625ae5c79.png)

Powyższy diagram przedstawia interakcję kuriera oraz integrację z systemami płatności i powiadomień.

-----------------------------------------------
# **Architektura systemu**

![image.png](.attachments/image-7fcf4aa7-7683-41e4-84d0-952af3bdf623.png)

Diagram przedstawia architekturę aplikacji podzieloną na trzy główne warstwy:
1.  Frontend (React) – Odpowiada za interakcję z użytkownikiem. Przeglądarka wysyła żądania do interfejsu użytkownika, który komunikuje się z backendem.
2.  Backend (Node.js) – Obsługuje logikę biznesową i przetwarza żądania użytkowników. Komunikuje się z bazą danych oraz zewnętrznymi systemami.
3.  Baza danych (MongoDB) – Przechowuje informacje o użytkownikach, zamówieniach oraz produktach.

Dodatkowo backend integruje się z:  
- Zewnętrznym systemem płatności – Odpowiada za obsługę transakcji.  
- Systemem powiadomień – Wysyła powiadomienia do użytkowników np. o statusie zamówienia.

--------------------------------------------------
# **Diagramy sekwencji dla wybranej funkcjonalności**

## a) Logowanie użytkownika

![image.png](.attachments/image-6dac1a88-63df-4248-baa7-52c8a5ef244b.png)

Diagram przedstawia proces logowania użytkownika. Po wprowadzeniu danych frontend przesyła je do backendu, który weryfikuje je w bazie danych i zwraca odpowiedni status.

## b) Składanie zamówienia

![image.png](.attachments/image-ada0633a-4bb9-4102-9f9c-f79f75646dd4.png)

Diagram przedstawia proces składania zamówienia przez użytkownika, jego zapis w bazie danych, przetwarzanie płatności za pomocą zewnętrznego systemu płatności oraz poinformowanie użytkownika o statusie zamówienia.

# **Wybór i uzasadnienie użytej technologii**
------------------------------------------

## Język programowania: JavaScript (ES6+) - Wersja: ES2022  

Uzasadnienie:

*   JavaScript jest wszechstronny i może być używany zarówno po stronie frontendu, jak i backendu.
*   Duża społeczność i wsparcie dla nowoczesnych technologii webowych.
    
## Framework:

**Frontend:** React.js (Wersja: 18.2.0)  

Uzasadnienie:

*   Pozwala na tworzenie dynamicznych i responsywnych interfejsów użytkownika.
*   Posiada bogaty ekosystem bibliotek wspomagających rozwój aplikacji (np. Redux).
    
**Backend:** Node.js + Express.js (Wersja: 22.11.0, Express 4.18.2)  

**Uzasadnienie:**
*   Node.js umożliwia obsługę wielu żądań jednocześnie, co poprawia wydajność.    
*   Express.js jest lekki i elastyczny, umożliwia szybkie tworzenie API REST.
    

## Baza danych: MongoDB (Wersja: 6.0)

Uzasadnienie:

*   Dokumentowa baza danych dobrze pasuje do dynamicznych aplikacji webowych.  
*   Skalowalność i szybki dostęp do danych.
    

## System operacyjny: Windows 11

Uzasadnienie:

*   Windows 11 zapewnia stabilne środowisko deweloperskie i jest kompatybilny z narzędziami wymaganymi do tworzenia aplikacji webowych.
    
*   Posiada wsparcie dla najnowszych wersji Node.js oraz React.js, co ułatwia zarządzanie projektem.
    
# **Diagram ERD dla systemu zamówień posiłków** 
------------------------------------------
**Opis:** Diagram przedstawia relacje pomiędzy encjami w systemie.

## Encje:

### **User**

*   `UserId`: ObjectId
    
*   `name`: string
    
*   `email`: string
    
*   `password`: string
    
*   `role`: string ("customer", "admin", "courier")
    

### **Order**

*   `orderId`: ObjectId
    
*   `userId`: ObjectId (relacja do User)
    
*   `items`: Array (lista posiłków)
    
*   `totalPrice`: number
    
*   `status`: string ("pending", "in progress", "delivered")
    

### **Meal**

*   `mealId`: ObjectId
    
*   `name`: string
    
*   `price`: number
    
*   `description`: string
    
*   `image`: string (URL do obrazka posiłku)


### **Cart**

*   `cartId`: ObjectId
    
*   `userId`: ObjectId (relacja do User)
    
*   `items`: Array (lista posiłków i ich ilości)
    

### **Relacje:**

*   Jeden **User** może mieć wiele **Order** (1:N)
    
*   Jeden **Order** może zawierać wiele **Meal** (1:N)

*   Po finalizacji zamówienia dane z koszyka są kopiowane do **Order**, a koszyk jest opróżniany.

# **Makieta interfejsu użytkownika**
---------------------------------

**Opis:** Poniższe ekrany pokazują główne widoki aplikacji, ich układ i funkcjonalności.


### **Ekran główny**

*   Nagłówek
    
*   Menu nawigacyjne

*   Lista posiłków
    
*   Przycisk "Dodaj do koszyka"
    
![image.png](.attachments/image-3aef4b16-061c-4486-abfa-9b84a72b4b0b.png)


### **Ekran logowania**

*   Pole na e-mail
    
*   Pole na hasło
    
*   Przycisk "Powrót"

*   Przycisk "Zaloguj się"
 
![image.png](.attachments/image-9de379a6-bc9d-40f9-b596-c4b330369981.png)


### **Ekran rejestracji** 

* Pole na imię 

* Pole na e-mail
 
* Pole na hasło 

* Przycisk "Powrót"

* Przycisk "Zarejestruj" 

![image.png](.attachments/image-0514edf5-d045-46f7-970a-fd0b19c2f200.png)


### **Zamówienie** 

* Dane kontaktowe 

* Szczegóły zamówienia 

* Status zamówienia 

* Całkowita Kwota 

![image.png](.attachments/image-5942a52b-236e-4a8a-a2c9-0b6960d7c8c9.png)

## Dokumentacja API

Interaktywna dokumentacja Swagger UI: (http://localhost:3000/docs)

------------------------------------------

### Zrealizowane wymagania funkcjonalne

| Nazwa | Priorytet | Status | Uwagi |
| --- | --- | --- | --- |  
| Rejestracja użytkownika | Wysoki | :heavy_check_mark: | Rejestracja z walidacją danych (e-mail potwierdzający niezaimplementowany) |
| Logowanie | Wysoki | :heavy_check_mark: | Użytkownik może się zalogować – system zapamiętuje go za pomocą tokena JWT |
| Przeglądanie listy posiłków | Wysoki | :heavy_check_mark: | Każdy może przeglądać dostępne dania z opisem i ceną | 
| Zarządzanie koszykiem | Wysoki | :heavy_check_mark: | Użytkownik może dodawać, usuwać i zmieniać ilość posiłków |
| Składanie zamówienia | Wysoki | :heavy_check_mark: | Można sfinalizować zamówienie i opłacić je online (zapis do MongoDB) | 
| Obsługa płatności | Wysoki | :heavy_check_mark: | System łączy się z bramką płatniczą Stripe |
| Powiadomienia o statusie zamówienia | Średni | :x: | Brak powiadomień – status widać tylko po zalogowaniu |
| System ocen i recenzji | Średni | :x: | Nie zostało zrobione – zaplanowane jako opcja dodatkowa |
| Historia zamówień | Średni | :heavy_check_mark: | Użytkownik może zobaczyć poprzednie zamówienia | 
| Zarządzanie menu restauracji (admin) | Wysoki | :heavy_check_mark: | Admin może dodać, edytować i usunąć posiłek | 
| Obsługa zwrotów i reklamacji | Średni | :x: | Brak – nie było wymagane na ten etap |
| Generowanie raportów sprzedaży | Średni | :x: | Nie zostało zrobione – zaplanowane jako dodatkowa opcja |
| Obsługa promocji i kodów rabatowych | Średni | :x: | Nie zostało zrobione – zaplanowane jako dodatkowa opcja |
| Integracja z mapą dostaw | Średni | :x: | Nie zostało zrobione – wymaga dodatkowych usług mapowych |
| Panel admina | Wysoki | :heavy_check_mark: | Admin może zarządzać daniami i zamówieniami przez interfejs `Menu.jsx` i `Orders.jsx` | 

------------------------------------------

#### Formularz rejestracji
![image.png](.attachments/image-42ada6d5-eba9-428e-9c77-6665f6e13e9b.png)
![image.png](.attachments/image-1b327dff-7e99-4be7-acdc-8a9b32e9bacd.png)
![image.png](.attachments/image-681c2c5c-228f-4530-b833-563ff876399a.png)

#### Błąd walidacji przy rejestracji
![image.png](.attachments/image-b4e6b71c-370f-47a4-816e-7eaf2b02c5d6.png)
![image.png](.attachments/image-b1b9571a-0f25-451a-99d8-91b3cf3c8b51.png)
![image.png](.attachments/image-06b52d04-5995-433b-8bdd-c0bd1f37bdba.png)

#### Formularz logowania
![image.png](.attachments/image-ae3dd053-b7b2-4341-8ba9-cb30f7d01359.png)


#### Widok po zalogowaniu
![image.png](.attachments/image-d13da5bc-da82-43d2-a64d-d2aa310b9eae.png)


#### Przeglądanie listy posiłków
![image.png](.attachments/image-7061ecdf-1a9a-485c-b390-7eedbf608acb.png)


#### Koszyk z dodanymi produktami
![image.png](.attachments/image-1ba6e705-de07-4902-9c41-532b2e965616.png)


#### Formularz zamówienia
![image.png](/.attachments/image-fe3c5b

#### Podsumowanie płatności
![image.png](.attachments/image-aafe8dd1-6e5a-4a91-b720-826d6e114e27.png)


#### Widok płatności Stripe
![image.png](.attachments/image-8a5ec0b9-de4b-495f-aa20-b74b06ac2c1a.png) 


#### Historia zamówień
![image.png](.attachments/image-46458975-f3ba-499d-b451-519795534024.png) 


#### Edycja posiłku (admin)
![image.png](.attachments/image-8f0f03b0-33c6-43e6-bae0-221ea61f783c.png) 


#### Dodawanie nowego posiłku
![image.png](.attachments/image-9250ec35-aaad-48a2-93fb-1d341126bcf9.png) 
![image.png](.attachments/image-b988232b-e083-498a-8000-8ef68756e11d.png) 
![image.png](.attachments/image-2c84aca7-5ef1-4026-be15-c9cd1cc2d510.png)


#### Panel zamówień (admin)
![image.png](.attachments/image-f40916e3-d218-4e01-9a07-850bcb285015.png)

------------------------------------------

### Zrealizowane wymagania niefunkcjonalne

| Nazwa | Priorytet | Status | Uwagi |
| --- | --- | --- | --- |
| Wydajność | Wysoki | :heavy_check_mark: | Aplikacja działa płynnie lokalnie |
| Skalowalność | Wysoki | :x: | Nie ma jeszcze wdrożonego środowiska do skalowania |
| Bezpieczeństwo | Wysoki | :heavy_check_mark: | JWT, role, walidacje, brak danych wrażliwych w odpowiedziach |
| Dostępność | Wysoki | :x: | Aplikacja lokalna działa stabilnie, ale nie ma jeszcze ciągłego hostingu |
| Obsługa błędów | Średni | :heavy_check_mark: | Błędy są czytelnie pokazywane użytkownikowi, także w API |
| Kompatybilność | Średni | :x: | Działa poprawnie na komputerach - nie uruchamiane na urządzeniach mobilnych |
| Łatwość użycia | Średni | :heavy_check_mark: | Interfejs jest prosty i intuicyjny – użytkownicy łatwo się odnajdują. |
| Czas odpowiedzi | Wysoki | :heavy_check_mark: | Wszystkie żądania ładują się szybko – poniżej 100ms lokalnie |
| Przetwarzanie płatności | Wysoki | :heavy_check_mark: | Zintegrowano Stripe – działa poprawnie z przekazywaniem danych |
| Kopie zapasowe | Średni | :x: | Brakuje automatycznego systemu tworzenia kopii bazy danych |

# **Testy jednostkowe**

![image.png](.attachments/image-7a81e5f4-895b-4e4a-9e88-e13c5f0a5841.png)

------------------------------------------

# **Testy Integracyjne**

![image.png](.attachments/image-95eaf5d6-fbfc-406a-90e0-c293f14281a9.png)

------------------------------------------

# **Testy Opis testów manualnych**

## :heavy_check_mark: **Logowanie użytkownika – pozytywny scenariusz**

**Cel:** Sprawdzić, czy użytkownik z poprawnymi danymi może się zalogować
**Kroki:**
1.  Kliknij „Zaloguj” w nagłówku.
    
2.  Wpisz istniejący email i hasło.
    
3.  Kliknij przycisk „Zaloguj”.

![image.png](.attachments/image-05b4b867-b010-4bc4-bb10-a0773c1dc1d7.png)
    
**Oczekiwany rezultat:**
*   Formularz logowania znika.
    
*   W nagłówku pojawia się przycisk „Zamówienia” i „Wyloguj”.
    
![image.png](.attachments/image-11f45230-2cb2-4638-93c3-3b703098fd9f.png)

* * *

### :x: **2. Logowanie użytkownika – negatywny scenariusz**

**Cel:** Sprawdzić reakcję systemu na błędne dane logowania.
**Kroki:**
1.  Kliknij „Zaloguj”.
    
2.  Podaj nieistniejący email lub błędne hasło.
    
3.  Kliknij „Zaloguj”.

![image.png](.attachments/image-ac9322c7-163e-4c93-abd2-5e435ffed563.png)
    
**Oczekiwany rezultat:**
*   Pojawia się modal z błędem „Błąd logowania”.
    
*   Wiadomość: „Nieprawidłowe dane logowania”.

![image.png](/.attachments/image-68a90f02-b96e-4e81-b38c-332c792924ad.png)

* * *

### :heavy_check_mark: **3. Rejestracja nowego użytkownika – pozytywny scenariusz**

**Cel:** Upewnić się, że nowy użytkownik może się zarejestrować.
**Kroki:**
1.  Kliknij „Rejestracja”.
    
2.  Wprowadź unikalne imię, email i hasło (min. 6 znaków).
    
3.  Kliknij „Zarejestruj”.

![image.png](.attachments/image-220f41b9-cf77-4c93-8660-dd55b25bb99b.png)
    
**Oczekiwany rezultat:**
*   Formularz znika.

![image.png](.attachments/image-9c0f35c7-0124-48d8-9c9d-e7dbd772be11.png)
    
*   Użytkownik zostaje automatycznie zalogowany.
    
![image.png](.attachments/image-c3f91a67-68cd-4cee-b69a-5b01cf04daab.png)

* * *

### :x: **4. Złożenie zamówienia bez logowania**

**Cel:** Sprawdzić zabezpieczenia – czy niezalogowany użytkownik może składać zamówienie.
**Kroki:**
1.  Dodaj kilka produktów do koszyka.
    
2.  Kliknij „Koszyk” → „Przejdź do płatności”.

![image.png](.attachments/image-d2bde0d9-e788-454a-9fc2-5bd5ec7b293f.png)
    
**Oczekiwany rezultat:**
*   Pojawia się modal z informacją: „Nie jesteś zalogowany”.
    
*   Widoczne przyciski „Zaloguj się” i „Zarejestruj się”.
    
![image.png](.attachments/image-21900dc8-d7eb-46ed-940b-e92c70138674.png)

* * *

### :heavy_check_mark: **5. Składanie zamówienia jako zalogowany użytkownik**

**Cel:** Sprawdzić pełną ścieżkę zakupu.
**Kroki:**
1.  Zaloguj się jako użytkownik.

![image.png](.attachments/image-d8cbb3ce-c884-4138-b938-79d4041d0607.png)
    
2.  Dodaj kilka dań do koszyka.
    
3.  Kliknij „Koszyk” → „Przejdź do płatności”.
    
4.  Uzupełnij formularz i dane karty (testowe).
    
5.  Kliknij „Zapłać i złóż zamówienie”.

![image.png](.attachments/image-dd053186-54e9-47b1-acc4-364d44e81c74.png)
    
**Oczekiwany rezultat:**
*   Pojawia się komunikat „Zamówienie przyjęte!”.

![image.png](.attachments/image-f924edb5-8f1d-45cd-b1b7-5f52e3a5738c.png)
    
*   Przycisk „Przejdź do zamówień” przenosi do listy.

![image.png](.attachments/image-d36a4e42-2413-40be-a87b-e99cc298b5af.png)

| **Funkcjonalność** | **Miejsce w kodzie** |
| --- | --- |
| Logowanie użytkownika (pozytywny/negatywny) | `src/components/Login.jsx`  <br>+ logika: `src/store/AuthContext.jsx` |
| Rejestracja użytkownika | `src/components/Register.jsx`  <br>+ logika: `src/store/AuthContext.jsx` |
| Sprawdzenie czy użytkownik jest zalogowany | `UserProgressContext` -> `progress === LOGIN/REGISTER/CHECKOUT` |
| Zamówienie przez zalogowanego użytkownika | `src/components/Checkout.jsx` + `src/components/Cart.jsx` |
| Zamówienie bez zalogowania  | `src/components/Cart.jsx` + `Checkout.jsx` + `AuthContext.isLoggedIn` |
| Modal „Nie jesteś zalogowany” | `src/components/Modal.jsx` + `src/components/Checkout.jsx` |

------------------------------------------

# **Raport wydajnościowy**

![image.png](.attachments/image-82959618-efb5-4cf4-8980-20b7fa62f8f1.png)
![image.png](.attachments/image-2baeb0df-9bf3-439d-b3ee-10c11a062e0c.png)
![image.png](.attachments/image-2fbbc8b0-8ddb-45ec-8801-fc8d5177d648.png)
![image.png](.attachments/image-36bb57da-dcf5-4324-885c-ae8392c9ff38.png)


# Główne wskaźniki i problemy wydajności

## Problem 1: Ogromne obrazy JPEG 

Rozwiązanie: 
Przekonwertowanie ich do formatu WebP 

### Test po wprowadzeniu zmian
![image.png](.attachments/image-6390df2c-0f64-42a2-9235-0d3797690207.png)

## Problem 2: Stripe jest ładowany zawsze 

Rozwiązanie: 
Dynamicznie importuj oraz użyj `React.lazy()` i `Suspense` `Checkout.jsx`, `Orders.jsx` i `Menu.jsx` w `App.jsx`

### Test po wprowadzeniu zmian
![image.png](/.attachments/image-47989e31-17d7-4398-9e53-9744dcd2d562.png)
