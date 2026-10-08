# language.js documentation
This file allows all games to retrieve the current language of the main menu.
It also allows the main menu to set a global variable for the current language.

## Methods

### ```language.get()```
Retrieves current language

**Returns:**
- `sv` if current language is Swedish
- `en` if current language is English

**Example:**
```js
const currentLang = language.get();
```

---

### ```language.set(lang)```
Changes current language to lang.

**Parameters:**
- `lang` ('en' || 'sv'): New current language

---

**Example:**

```js
const newLang = 'en';
language.set(newLang);
```

### ```language.is_swedish()```
Checks if current language is swedish.

**Returns:**
- True if current language is Swedish
- False if current language is English

**Example:**
```js
const currentLang = language.set('sv');
if(language.is_swedish())
    console.log("This will print");
```

---

### ```language.is_english()```
Checks if current language is English.

**Returns:**
- True if current language is English
- False if current language is Swedish

**Example:**
```js
const currentLang = language.set('en');
if(language.is_english())
    console.log("This will print");
```
