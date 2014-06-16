var User = DS.Model.extend({
    username: DS.attr('string'),
    aliases: DS.hasMany('person', { async: true})
});

export default User;
