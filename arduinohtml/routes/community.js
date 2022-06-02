const express = require('express');
const Community = require('../models/community');
const router = express.Router();


router.get('/', (req, res, next) => {
    Community.find({}, (err, community) => {
        res.render('Community/community', {community});
    }).sort({createdAt: 'desc'})
});

router.get('/new', (req,res,next) => {
    res.render('new', { community: new Community() })
})

router.get('/edit/:id', async (req,res,next) => {
    const community = await Community.findById(req.params.id)
    const user =req.session.email
    if(community.user == user)
    {
        res.render('edit', { community: community })
    } else {
        res.redirect('/community/' + community._id)
    }
    
})

router.get('/:id', async(req,res) => {
    const community = await Community.findById(req.params.id)
    if(community == null) res.redirect('/community')
    console.log('show : ' , community)
    res.render('show', { community : community })
})

router.post('/make',  async(req,res,next) => {
    let community = new Community({
        title: req.body.title,
        user: req.session.email,
        markdown: req.body.markdown,
        thumbnailURL: req.body.thumbnailURL,
        keyword: req.body.keyword,
        description:req.body.description,
    })
    try{
        await community.save() 
        console.log('저장 : ', community)
        res.redirect('/community/' + community._id)
    } catch (e) {
        console.log(e);
        res.render('new', { community : community});
    }   
})// 데이터베이스에 저장

router.post('/resave/:id' , async (req,res,next) => {
    const community = await Community.findById(req.params.id)
    const user =req.session.email
    if(community.user == user)
    {
        community.title = req.body.title
        community.markdown = req.body.markdown
        community.createdAt = Date.now()
        try{
            await community.save() 
            console.log('저장 : ', community)
            res.redirect('/community/' + community._id)
        } catch (e) {
            console.log(e);
            res.render('new', { community : community});
        }    
    } else {
        res.redirect('/community/' + community._id)
    }
 
})


router.get('/delete/:id', async (req,res,next) => {
    const community = await Community.findById(req.params.id)
    const user =req.session.email
    console.log('삭제 비교 : ', user)
    console.log('삭제 비교 : ', community.user)
    if(community.user == user)
    {
        Community.remove({_id: community._id}, function(ree, output) {
        res.redirect('/community')
        })
    } else {
        res.redirect('/community')
    }
})


router.get('/userdetail/:id', (req, res, next) => {
    let user = splitemail(req.params.id)
    Community.find({user:req.params.id}, (err, community) => {
      console.log("userdetail community : ",community);
      res.render('Community/userdetail', {community, user:user[0]});
    }).sort({createdAt: 'desc'})
});

function splitemail(str){
    return str.split("@")
}



module.exports = router;