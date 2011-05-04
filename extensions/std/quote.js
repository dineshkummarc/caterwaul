// Quotation behavior | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Quotation is very important for defining macros. It enables the qs[] form in your code, which returns a piece of quoted syntax. qs is an adjective, and its exact rendition depends on which
// language port you're using. For the native JS port, it will be enabled in these forms:

// | qs[x]
//   x /qs

// Also available is qse[], which pre-expands the syntax tree before returning it.

  caterwaul.configuration('core.quote', function () {this.modifier('qs',  function (match) {return new this.ref(match._expression)}).
                                                          modifier('qse', function (match) {return new this.ref(this.macroexpand(match._expression))})});
// Generated by SDoc 