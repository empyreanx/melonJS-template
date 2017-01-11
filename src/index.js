import me from 'melonJS';
import resources from './resources';

var game = {
    init: function () {
        console.log('Starting ' + me.mod + ' (' + me.version + ')');

        if (!me.video.init(800, 600, {wrapper : 'screen', scale : 'auto', scaleMethod : 'flex-width', renderer : me.video.AUTO, subPixel : false })) {
            alert('Your browser does not support HTML5 canvas.');
            return;
        }

        // initialize the sound engine
        me.audio.init('mp3,ogg');

        // set all ressources to be loaded
        me.loader.preload(resources, this.loaded.bind(this));
    },

    loaded: function () {
        console.log('Resources loaded!');
        me.audio.play('jump');
    }
};

export default game;
