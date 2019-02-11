const config = require('./config');

module.exports = class Post
{
    constructor (args)
    {
        this.post_id = GetPostId();
        this.author = args.author;
        this.author_bitmoji = args.author_bitmoji;
        this.category = args.category;
        this.title = args.title;
        this.description = args.description;
        this.time = args.time; // .start and .end
        this.location = args.location; // .lat and .lon
        this.attendees = {} // List of people going to the event
    }

    /**
     * Returns a nice json object ready to be sent to a client
     */
    get_sync_object ()
    {
        return {
            datatype: "post",
            post_id: this.post_id,
            author: this.author,
            author_bitmoji: this.author_bitmoji,
            category: this.category, 
            title: this.title,
            description: this.description,
            time: this.time,
            location: this.location,
            attendees: this.attendees
        }
    }

    has_attendee (id)
    {
        return this.attendees[id] != null;
    }

    add_attendee (args)
    {
        if (this.has_attendee(args.id)) {return;}
        this.attendees[args.id] = args;
    }

    remove_attendee (args)
    {
        if (!this.has_attendee(args.id)) {return;}
        this.attendees[args.id] = null;
    }

}



function GetPostId()
{
    return config.post_id++;
}