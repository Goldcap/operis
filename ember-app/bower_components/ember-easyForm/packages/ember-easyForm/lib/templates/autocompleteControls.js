Ember.EasyForm.Config.registerTemplate('easyForm/autocompleteControls', Ember.Handlebars.compile('{{input-field propertyBinding="view.property" inputOptionsBinding="view.inputOptionsValues"}}{{#if view.showError}}{{error-field propertyBinding="view.property"}}{{/if}}{{#if view.hint}}{{hint-field propertyBinding="view.property" textBinding="view.hint"}}{{/if}}<ul class="blowme">{{#each view.searchResults}}<li {{action "setValue" this target="view"}}>{{this.formatted}}</li>{{/each}}</ul>'));