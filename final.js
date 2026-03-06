/* ============================================================
   四川大学萌战 —— 最终结果页 (final.js)
   从 LeanCloud 数据库读取数据
   ============================================================ */

var BASE_DATA = [
    { id:1,  name:"初音未来",       anime:"VOCALOID",              group:"vtuber",  emoji:"🎤", votes:0 },
    { id:2,  name:"蕾姆",           anime:"Re:从零开始的异世界生活", group:"anime",   emoji:"💙", votes:0 },
    { id:3,  name:"灶门炭治郎",     anime:"鬼灭之刃",              group:"anime",   emoji:"🔥", votes:0 },
    { id:4,  name:"2B",             anime:"尼尔：机械纪元",         group:"game",    emoji:"⚔️", votes:0 },
    { id:5,  name:"五条悟",         anime:"咒术回战",               group:"anime",   emoji:"👁️", votes:0 },
    { id:6,  name:"阿尼亚·福杰",   anime:"间谍过家家",             group:"anime",   emoji:"🥜", votes:0 },
    { id:7,  name:"雷电将军",       anime:"原神",                   group:"game",    emoji:"⚡", votes:0 },
    { id:8,  name:"路飞",           anime:"ONE PIECE 海贼王",       group:"comic",   emoji:"👒", votes:0 },
    { id:9,  name:"洛天依",         anime:"VOCALOID",              group:"vtuber",  emoji:"🎵", votes:0 },
    { id:10, name:"漩涡鸣人",       anime:"火影忍者",               group:"comic",   emoji:"🍥", votes:0 },
    { id:11, name:"钟离",           anime:"原神",                   group:"game",    emoji:"🪨", votes:0 },
    { id:12, name:"御坂美琴",       anime:"某科学的超电磁炮",       group:"anime",   emoji:"⚡", votes:0 },
    { id:13, name:"坂田银时",       anime:"银魂",                   group:"anime",   emoji:"🍓", votes:0 },
    { id:14, name:"林克",           anime:"塞尔达传说",             group:"game",    emoji:"🗡️", votes:0 },
    { id:15, name:"藤本千空",       anime:"Dr.STONE 石纪元",       group:"anime",   emoji:"🧪", votes:0 },
    { id:16, name:"虎杖悠仁",       anime:"咒术回战",               group:"anime",   emoji:"👊", votes:0 }
];

var GROUP_LABELS = { anime:"🎬 动画", game:"🎮 游戏", comic:"📚 漫画", vtuber:"🎤 虚拟歌手" };
var COLORS = ["#e94560","#ff6b81","#533483","#7c5cbf","#0f3460","#1a5276","#ffd700","#f39c12","#2ecc71","#1abc9c","#e67e22","#e74c3c","#9b59b6","#3498db","#1dd1a1","#ff9ff3"];

document.addEventListener("DOMContentLoaded", async function(){
    try {
        var chars = await loadFromDB();
        var total = 0;
        chars.forEach(function(c){ total+=c.votes; });
        renderChampion(chars[0], total);
        renderPodium(chars.slice(0,3), total);
        renderGroupChamps(chars);
        renderFinalStats(chars, total);
        renderFinalChart(chars);
        renderFinalTable(chars, total);
    } catch(err) {
        console.error('加载最终结果失败:', err);
    }
});

async function loadFromDB() {
    var data = BASE_DATA.map(function(c){
        return {id:c.id,name:c.name,anime:c.anime,group:c.group,emoji:c.emoji,votes:c.votes};
    });
    var votesMap = await dbFetchVotes();
    data.forEach(function(c){ if(votesMap[c.id]!==undefined) c.votes=votesMap[c.id]; });
    data.sort(function(a,b){ return b.votes-a.votes; });
    return data;
}

function renderChampion(champ, total){
    if(!champ) return;
    var pct = total>0?((champ.votes/total)*100).toFixed(1):"0.0";
    document.getElementById("champion-card").innerHTML =
        '<div class="champ-emoji">'+champ.emoji+'</div><div class="champ-info"><div class="champ-crown">👑</div><h2 class="champ-name">'+champ.name+'</h2><p class="champ-anime">《'+champ.anime+'》</p><div class="champ-votes">'+champ.votes.toLocaleString()+' 票</div><div class="champ-pct">占总票数 '+pct+'%</div></div>';
}

function renderPodium(top3){
    if(top3.length<3) return;
    var order=[top3[1],top3[0],top3[2]]; var labels=["🥈 第二名","🥇 第一名","🥉 第三名"]; var heights=["180px","240px","140px"];
    var html="";
    order.forEach(function(c,i){
        html+='<div class="podium-item p'+(i===1?'1':i===0?'2':'3')+'"><div class="podium-char-emoji">'+c.emoji+'</div><div class="podium-char-name">'+c.name+'</div><div class="podium-char-votes">'+c.votes.toLocaleString()+' 票</div><div class="podium-block" style="height:'+heights[i]+'"><div class="podium-label">'+labels[i]+'</div></div></div>';
    });
    document.getElementById("podium").innerHTML=html;
}

function renderGroupChamps(chars){
    var groups={};
    chars.forEach(function(c){ if(!groups[c.group]) groups[c.group]=c; });
    var html="";
    Object.keys(groups).forEach(function(g){
        var c=groups[g];
        html+='<div class="gc-result-card"><div class="gc-result-group">'+(GROUP_LABELS[g]||g)+'</div><div class="gc-result-emoji">'+c.emoji+'</div><h3>'+c.name+'</h3><p>《'+c.anime+'》</p><div class="gc-result-votes">'+c.votes.toLocaleString()+' 票</div></div>';
    });
    document.getElementById("group-champs").innerHTML=html;
}

function renderFinalStats(chars,total){
    document.getElementById("final-stats").innerHTML =
        '<div class="fs-card"><div class="fs-num">'+total.toLocaleString()+'</div><div class="fs-label">总投票数</div></div>'+
        '<div class="fs-card"><div class="fs-num">'+chars.length+'</div><div class="fs-label">参选角色</div></div>'+
        '<div class="fs-card"><div class="fs-num">'+Object.keys(GROUP_LABELS).length+'</div><div class="fs-label">参赛组别</div></div>'+
        '<div class="fs-card"><div class="fs-num">'+(total>0?Math.round(total/chars.length):0)+'</div><div class="fs-label">平均得票</div></div>';
}

function renderFinalChart(chars){
    var ctx=document.getElementById("finalBarChart").getContext("2d");
    new Chart(ctx,{type:"bar",data:{labels:chars.map(function(c){return c.emoji+" "+c.name;}),datasets:[{label:"票数",data:chars.map(function(c){return c.votes;}),backgroundColor:chars.map(function(_,i){return COLORS[i%COLORS.length];}),borderRadius:6,borderSkipped:false}]},options:{indexAxis:"y",responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"#8888aa"},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"#f0f0f0",font:{size:13}},grid:{display:false}}}}});
}

function renderFinalTable(chars,total){
    var tbody=document.getElementById("final-rank-tbody"); var html="";
    chars.forEach(function(c,idx){
        var rank=idx+1; var pct=total>0?((c.votes/total)*100).toFixed(1):"0.0";
        var rd,rc;
        if(rank===1){rd="🥇";rc="gold";}else if(rank===2){rd="🥈";rc="silver";}else if(rank===3){rd="🥉";rc="bronz";}else{rd="#"+rank;rc="";}
        html+='<tr><td class="col-rank '+rc+'">'+rd+'</td><td>'+c.emoji+' <strong>'+c.name+'</strong></td><td>《'+c.anime+'》</td><td>'+(GROUP_LABELS[c.group]||c.group)+'</td><td><strong>'+c.votes.toLocaleString()+'</strong></td><td class="col-bar">'+pct+'%<div class="mini-bar"><div class="mini-bar-fill" style="width:'+pct+'%"></div></div></td></tr>';
    });
    tbody.innerHTML=html;
}