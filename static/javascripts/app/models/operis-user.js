var OperisUser = DS.Model.extend({
    username: DS.attr('string'),
    email: DS.attr('string'),
    aliases: DS.hasMany('person', { async: true})
});

export default OperisUser;