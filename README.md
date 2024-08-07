# HTML To Table

> DEMO: https://w99910.github.io/html-to-table/

### It's zero dependency.

I have been trying to send emails using html layout but there are lots of html elements and styles that email clients
don't support.

So I am working on this library to convert almost html layout to email-compatible table layout.

> Note: this library do not cover most of the layout automagically. Feel free to pull and change it yourself as you
> needs.

## Installation

```
npm i html-to-table
```

## Usage

It is pretty straight-forward to use.

- Initialise the class

```js
let html2table = new HTML2Table();
```

- (Optional) - You can filter the elements you don't want to include in the output using Regex Expression
  This checks the `class` name and `id`.

```js
html2table.excludeElementByPattern('toolbar')
```

- Convert the element you want by calling `convert` and passing the element as parameter.

```js
html2table.convert(document.querySelector('your-element-to-convert'));
```

## MIT LICENSE

## CHANGELOG

- **0.1.0** - Rewrite the logic by using bounding client rect to determine the layout
