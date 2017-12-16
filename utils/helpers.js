function checkArgs(types, vals) {
	for (var i=0; i<types.length; i++) {
        if (vals[i] === null) {
            console.log("null value found");
            continue;
        }
		if (typeof types[i] === 'object') {
			var t1 = true;
			if (typeof vals[i] !== types[i][0]) {
				t1 = false;
			}
			if (t1 === false) {
				if (typeof vals[i] !== types[i][1]) {
					return [false,types[i],i,typeof vals[i]];
				}
			}
		} else {
			if (typeof vals[i] !== types) {
				return [false,types[i],i,typeof vals[i]];
			}
		}
	}
	return [true,'',vals.length];
}

function makeEmbed(title, desc, color, author, footer, thumbnail, fields) {
    var res = checkArgs(['string', 'string', 'number', ['object', 'string'], ['object', 'string'], 'string', 'object'], [title, desc, color, author, footer, thumbnail, fields]);
    if (res[0]) {
        var embed = Discord.RichEmbed();
        if (title !== null) embed.setTitle(title);
        if (desc !== null) embed.setDescription(desc);
        if (color !== null) embed.setColor(color);
        if (author !== null) embed.setAuthor(author);
        if (footer !== null) embed.setFooter(footer);
        if (thumbnail !== null) embed.setThumbnail(thumbnail);
        if (fields !== null) {
            for (var i=0; i<fields.length; i++) {
                if (typeof fields[i][0] === 'string' && typeof fields[i][1] === 'string' && (typeof fields[i][2] === 'boolean' || typeof fields[i][2] === 'undefined')) {
                    embed.addField(fields[i]);
                }
            }
        }
        embed.setTimestamp();
        return embed;
    } else {
        return Discord.RichEmbed().setDescription("Failed to make embed. Args didn't check out. Expected: "+res[1]+" Index: "+res[2]+" Got: "+res[3]);
    }
}
