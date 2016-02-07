//// Routes
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});


Router.route('/', function () {
    this.render('navbar', {
        to: "navbar"
    });

    this.render('website_list', {
        to: "main"
    });
});
Router.route('/details/:_id', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website_detail', {
        to: "main",
        data: function () {
            var a = Websites.findOne({_id: this.params._id});
            console.log(a);
            return a;
        }
    });
});
/////
// template helpers
/////

// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {Votes: -1}});
    }
});
Template.registerHelper("prettifyDate", function (timestamp) {
    return moment(new Date(timestamp)).fromNow();
});
Template.registerHelper("username", function (userId) {

    var user = Meteor.users.findOne({_id: userId});
    if (user) {
        return user.username;
    } else {
        return "anonymous";
    }

});
/////
// template events
/////

Template.website_item.events({
    "click .js-upvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id " + website_id);

        // put the code in here to add a vote to a website!
        Websites.update({_id: website_id}, {$inc: {upVote: 1, Votes: 1}});


        return false;// prevent the button from reloading the page
    },
    "click .js-downvote": function (event) {

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id " + website_id);
        Websites.update({_id: website_id}, {$inc: {downVote: 1, Votes: -1}});
        // put the code in here to remove a vote from a website!

        return false;// prevent the button from reloading the page
    }
})
//Accounts
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});
Template.website_detail.events({
    "click .js-save-comment-form": function (event) {
        var comment = $("#commentnew").val();
        if (comment) {
            Websites.update({_id: this._id}, {
                $push: {
                    comments: {
                        text: comment,
                        createdOn: new Date(),
                        createdBy: Meteor.user()._id
                    }
                }
            });

            $("#commentnew").val("");
        }


        return false;
    }

});
Template.website_form.events({
    "click .js-toggle-website-form": function (event) {

        $("#url").val("");
        $("#title").val("");
        $("#description ").val("");

        $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form": function (event) {

        // here is an example of how to get the url out of the form:
        var url = event.target.url.value;
        var description = event.target.description.value;
        var title = event.target.title.value;
        var keepOpen = false;
        console.log(title);
        if (Meteor.user()) {

            if (url && description) {

                Websites.insert({
                    title: title,
                    url: url,
                    description: description,
                    createdOn: new Date(),
                    upVotes: 0,
                    downVotes: 0,
                    createdBy: Meteor.user()._id,
                    Votes: 0,
                    comments: []

                });
                keepOpen = false;

            } else {
                keepOpen = true;
                alert("Site address and Description must be added")
            }

        } else {
            alert("User must be logged in")

        }
        if (!keepOpen) {
            $("#website_form").toggle('slow');

        }
        //  put your website saving code in here!

        return false;// stop the form submit from reloading the page

    }
});