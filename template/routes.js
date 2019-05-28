import React from 'react';
import { Switch, Route } from 'react-router-dom';

{{#each menuNames}}
import {{this}} from './container/{{this}}';
{{/each}}

export default () => {
  return (
    <Switch>
      {{#each menuNames}}
      <Route path="/{{this}}" key="{{this}}" component={ {{this}} } exact />
      {{/each}}
    </Switch>
  )
}
