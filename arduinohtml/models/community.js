const mongoose = require('mongoose');
const hljs = require('../public/highlight.js');
const  md  = require('markdown-it')({ 
  html : true,
  linkify : true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  },

}).use(require('markdown-it-video', { // <-- this use(package_name) is required
  youtube: { width: 640, height: 390 },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 }
}))

const communitySchema = mongoose.Schema({ 
  title:{ type:String, required:true },
  user:{ type: String },
  markdown:{ type:String, required: true },
  description:{ type:String, validate : [

    function(category) {
    
    return category.length <= 120;
    
    },
    
    '지정 용량을 초과하였습니다.(120자 이내)'
  ]},
  keyword:{type:String, validate : [

    function(category) {
    
    return category.length <= 6;
    
    },
    
    '키워드가 너무 깁니다.(6자 이내)'
  ]},
  thumbnailURL:{type:String, required: true},
  createdAt:{ type:Date, default:Date.now() }, 
  makrdownHtml: { type:String, required: true },
});


communitySchema.pre('validate', function(next) {
  if(this.markdown){
    this.makrdownHtml = md.render(this.markdown)
  }
  next()  
})


module.exports = mongoose.model('Community', communitySchema);

