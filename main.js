/* ============================================================
   四川大学萌战 —— 投票页逻辑 (main.js)
   已接入 LeanCloud 云数据库，所有人共享同一份投票数据
   ============================================================ */

// ============================================================
// 【角色数据】在这里修改/添加角色
// votes 字段现在只是前端显示的初始值，
// 实际票数会从数据库读取并覆盖
// ============================================================
var CHARACTER_DATA = [
    { id:1,  name:"初音未来",          anime:"VOCALOID",                 group:"vtuber", description:"世界上最知名的虚拟歌手，标志性的蓝绿色双马尾，永远的16岁。",               emoji:"🎤", image:"", votes:0 },
    { id:2,  name:"蕾姆",              anime:"Re:从零开始的异世界生活",    group:"anime",  description:"罗兹瓦尔邸的双子女仆之一，蓝发蓝眸的鬼族少女，温柔又坚强。",             emoji:"💙", image:"", votes:0 },
    { id:3,  name:"灶门炭治郎",        anime:"鬼灭之刃",                  group:"anime",  description:"心地善良的炭烧少年，为拯救变成鬼的妹妹禰豆子而踏上战斗旅途。",           emoji:"🔥", image:"", votes:0 },
    { id:4,  name:"2B",                anime:"尼尔：机械纪元",             group:"game",   description:"YoRHa部队的二号B型战斗用人造人，冷静优雅的战士。",                       emoji:"⚔️", image:"", votes:0 },
    { id:5,  name:"五条悟",            anime:"咒术回战",                   group:"anime",  description:"东京都立咒术高专教师，当代最强咒术师，六眼与无下限术式的持有者。",         emoji:"👁️", image:"", votes:0 },
    { id:6,  name:"阿尼亚·福杰",      anime:"SPY×FAMILY 间谍过家家",      group:"anime",  description:"拥有读心超能力的可爱小女孩，最喜欢花生和间谍动画片，哇酷哇酷！",         emoji:"🥜", image:"", votes:0 },
    { id:7,  name:"雷电将军",          anime:"原神",                       group:"game",   description:"稻妻的雷神，追求永恒的神明，既威严又有着可爱的一面。",                   emoji:"⚡", image:"", votes:0 },
    { id:8,  name:"路飞",              anime:"ONE PIECE 海贼王",           group:"comic",  description:"草帽海贼团船长，橡胶果实能力者，梦想成为海贼王的自由男人！",             emoji:"👒", image:"", votes:0 },
    { id:9,  name:"洛天依",            anime:"VOCALOID",                   group:"vtuber", description:"中国最具人气的虚拟歌手，灰发绿瞳的元气少女。",                           emoji:"🎵", image:"", votes:0 },
    { id:10, name:"漩涡鸣人",          anime:"火影忍者",                   group:"comic",  description:"木叶村的超级忍者，九尾人柱力，永不放弃的热血少年，梦想成为火影！",       emoji:"🍥", image:"", votes:0 },
    { id:11, name:"钟离",              anime:"原神",                       group:"game",   description:"璃月往生堂客卿，真实身份是岩王帝君摩拉克斯，优雅博学但没有摩拉。",     emoji:"🪨", image:"", votes:0 },
    { id:12, name:"御坂美琴",          anime:"某科学的超电磁炮",           group:"anime",  description:"学园都市排名第三的Level 5超能力者，电击使（Railgun），性格率真。",       emoji:"⚡", image:"", votes:0 },
    { id:13, name:"坂田银时",          anime:"银魂",                       group:"anime",  description:"万事屋老板，白夜叉，爱吃甜食、爱看JUMP，嘴上不饶人但内心温柔。",       emoji:"🍓", image:"", votes:0 },
    { id:14, name:"林克",              anime:"塞尔达传说：王国之泪",       group:"game",   description:"海拉鲁的勇者，沉默寡言但勇敢无畏，永远在拯救公主的路上。",             emoji:"🗡️", image:"", votes:0 },
    { id:15, name:"藤本千空",          anime:"Dr.STONE 石纪元",           group:"anime",  description:"超级天才科学少年，要用科学之力复兴全人类，唆嘎～真是令人兴奋！",        emoji:"🧪", image:"", votes:0 },
    { id:16, name:"虎杖悠仁",          anime:"咒术回战",                   group:"anime",  description:"吞下宿傩手指的少年，身体能力异常强大，正义感爆棚的高中生。",            emoji:"👊", image:"", votes:0 }
];


// ============================================================
// 全局变量
// ============================================================
var characters     = [];
var currentFilter  = "all";
var remainingVotes = 3;
var votedIds       = [];
var isLoading      = true;


// ============================================================
// 页面加载 → 从数据库拉取数据
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    bindFilterButtons();
    bindSearchBox();
    bindModalClose();
    loadDataFromDB(); // 异步加载数据
});

async function loadDataFromDB() {
    // 显示加载状态
    var grid = document.getElementById("character-grid");
    grid.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

    try {
        // 1) 复制角色基础数据
        characters = CHARACTER_DATA.map(function (c) {
            return {
                id: c.id, name: c.name, anime: c.anime, group: c.group,
                description: c.description, emoji: c.emoji, image: c.image,
                votes: c.votes
            };
        });

        // 2) 从数据库读取实际票数
        var votesMap = await dbFetchVotes();
        characters.forEach(function (c) {
            if (votesMap[c.id] !== undefined) {
                c.votes = votesMap[c.id];
            }
        });

        // 3) 从数据库读取今天的投票状态
        var todayInfo = await dbFetchTodayInfo();
        votedIds       = todayInfo.votedIds;
        remainingVotes = todayInfo.remaining;

        // 4) 渲染页面
        isLoading = false;
        renderCards();
        renderTop5();
        updateStatsBar();

    } catch (err) {
        console.error('加载数据失败:', err);
        grid.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#ff6b81;">' +
            '⚠️ 数据加载失败，请检查网络连接后刷新页面<br>' +
            '<small style="color:#888;">错误信息：' + err.message + '</small></p>';
    }
}


// ============================================================
// 投票处理（改为调用数据库）
// ============================================================
async function handleVote(charId) {
    if (remainingVotes <= 0) {
        showModal("😅", "今日票数已用完", "每天最多投 " + MAX_DAILY_VOTES + " 票，明天再来吧！");
        return;
    }
    if (votedIds.indexOf(charId) !== -1) {
        showModal("🤔", "重复投票", "你今天已经为这个角色投过啦！");
        return;
    }

    // 找到角色名（用于弹窗显示）
    var charName = "";
    for (var i = 0; i < characters.length; i++) {
        if (characters[i].id === charId) { charName = characters[i].name; break; }
    }

    // 显示"投票中"状态（防止重复点击）
    var btns = document.querySelectorAll('.vote-btn');
    btns.forEach(function(b){ b.disabled = true; });

    // 调用数据库提交投票
    var result = await dbSubmitVote(charId);

    if (result.success) {
        // 更新本地数据
        votedIds.push(charId);
        remainingVotes = result.remaining;
        for (var j = 0; j < characters.length; j++) {
            if (characters[j].id === charId) {
                characters[j].votes = result.newVotes;
                break;
            }
        }
        // 刷新界面
        renderCards();
        renderTop5();
        updateStatsBar();

        showModal("🎉", "投票成功！",
            "你为「" + charName + "」投了一票！<br>" +
            "当前票数：<strong>" + result.newVotes + "</strong><br>" +
            "今日剩余：<strong>" + result.remaining + "</strong> 票"
        );
    } else {
        // 投票失败，恢复按钮
        renderCards();
        showModal("😅", "投票失败", result.message);
    }
}


// ============================================================
// 渲染角色卡片（和之前一样，没有改动）
// ============================================================
function renderCards(list) {
    var grid = document.getElementById("character-grid");
    var data = list || getFilteredList();
    data.sort(function (a, b) { return b.votes - a.votes; });

    if (data.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#8888aa;">没有找到匹配的角色 😥</p>';
        return;
    }

    var html = "";
    data.forEach(function (char, idx) {
        var rank      = idx + 1;
        var hasVoted  = votedIds.indexOf(char.id) !== -1;
        var rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-n";
        var btnClass  = hasVoted ? "vote-btn voted" : "vote-btn";
        var btnText   = hasVoted ? "✓ 已投" : "♥ 投TA";
        var disabled  = (hasVoted || remainingVotes <= 0) ? "disabled" : "";

        var visualHTML;
        if (char.image && char.image !== "") {
            visualHTML = '<div class="char-visual"><img src="' + char.image + '" alt="' + char.name + '"></div>';
        } else {
            visualHTML = '<div class="char-visual">' + char.emoji + '</div>';
        }

        html += '' +
            '<div class="char-card" data-group="' + char.group + '">' +
                '<div class="rank-badge ' + rankClass + '">' + rank + '</div>' +
                visualHTML +
                '<div class="char-body">' +
                    '<h3>' + char.name + '</h3>' +
                    '<div class="char-anime">《' + char.anime + '》</div>' +
                    '<p class="char-desc">' + char.description + '</p>' +
                '</div>' +
                '<div class="char-footer">' +
                    '<div class="vote-num"><strong>' + char.votes + '</strong> 票</div>' +
                    '<button class="' + btnClass + '" onclick="handleVote(' + char.id + ')" ' + disabled + '>' + btnText + '</button>' +
                '</div>' +
            '</div>';
    });
    grid.innerHTML = html;
}


// ============================================================
// TOP5 排行榜
// ============================================================
function renderTop5() {
    var sorted = characters.slice().sort(function (a, b) { return b.votes - a.votes; });
    var top5   = sorted.slice(0, 5);
    var maxV   = top5[0] ? top5[0].votes : 1;
    if (maxV === 0) maxV = 1;
    var box    = document.getElementById("top5-list");

    var html = "";
    top5.forEach(function (c, i) {
        var r     = i + 1;
        var rCls  = r === 1 ? "r1" : r === 2 ? "r2" : r === 3 ? "r3" : "rn";
        var pct   = Math.round((c.votes / maxV) * 100);
        html += '' +
            '<div class="top5-item">' +
                '<div class="top5-rank ' + rCls + '">' + r + '</div>' +
                '<div class="top5-emoji">' + c.emoji + '</div>' +
                '<div class="top5-info">' +
                    '<div class="t5-name">' + c.name + '</div>' +
                    '<div class="t5-anime">《' + c.anime + '》</div>' +
                    '<div class="top5-bar"><div class="top5-bar-fill" style="width:' + pct + '%"></div></div>' +
                '</div>' +
                '<div class="top5-votes">' + c.votes + '</div>' +
            '</div>';
    });
    box.innerHTML = html;
}


// ============================================================
// 统计栏
// ============================================================
function updateStatsBar() {
    var total = 0;
    characters.forEach(function (c) { total += c.votes; });
    document.getElementById("total-votes").textContent     = total.toLocaleString();
    document.getElementById("total-characters").textContent = characters.length;
    document.getElementById("remaining-votes").textContent  = remainingVotes;
}


// ============================================================
// 筛选 & 搜索
// ============================================================
function getFilteredList() {
    if (currentFilter === "all") return characters.slice();
    return characters.filter(function (c) { return c.group === currentFilter; });
}

function bindFilterButtons() {
    var btns = document.querySelectorAll(".filter-btn");
    btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            btns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-group");
            document.getElementById("search-input").value = "";
            renderCards();
        });
    });
}

function bindSearchBox() {
    var input = document.getElementById("search-input");
    input.addEventListener("input", function () {
        var kw = input.value.trim().toLowerCase();
        if (kw === "") { renderCards(); return; }
        var results = characters.filter(function (c) {
            return c.name.toLowerCase().indexOf(kw) !== -1 ||
                   c.anime.toLowerCase().indexOf(kw) !== -1;
        });
        renderCards(results);
    });
}


// ============================================================
// 弹窗
// ============================================================
function showModal(icon, title, msg) {
    document.getElementById("modal-icon").textContent  = icon;
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-message").innerHTML  = msg;
    document.getElementById("modal-overlay").classList.add("show");
}

function bindModalClose() {
    var overlay = document.getElementById("modal-overlay");
    var btn     = document.getElementById("modal-close-btn");
    btn.addEventListener("click", function () { overlay.classList.remove("show"); });
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) overlay.classList.remove("show");
    });
}