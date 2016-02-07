Websites = new Mongo.Collection("websites");

Websites.allow({
    insert: function(userId,doc){
        if(Meteor.user()){
            if(userId!=doc.createdBy){
                return false;
            }else{
                return true;
            }
        };
        return false;
    },
    update: function(userId,doc){
        if(Meteor.user()){
                return true;
        };

        return false;
    },
    remove: function(userId,doc){
        return false;
    },


})