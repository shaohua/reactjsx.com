module.exports = {
  "jquery": {
    "exports": "global:$"
  },
  "underscore": {
    "exports": "global:_"
  },
  "backbone" : {
    "exports": "global:Backbone",
    "depends": [
      "underscore:_",
      "jquery:$"
    ]
  }
};
