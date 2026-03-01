/* ============================================================
   ACG角色人气投票 —— 投票页面逻辑 (main.js)
   
   【给新手的说明】
   这个文件做了这几件事：
   1. 定义角色数据（名字、作品、票数等）
   2. 把角色卡片显示到页面上
   3. 处理"投票"按钮的点击
   4. 把投票数据保存在浏览器本地（关掉网页不会丢失）
   5. 处理筛选和搜索功能
   ============================================================ */

// ============================================================
// 【第一部分】角色数据
// ————————————————————————————————————————————
// 你可以在这里修改/添加角色！
// 每个角色有这些字段：
//   id          : 编号（不能重复）
//   name        : 角色名
//   anime       : 出自哪部作品
//   group       : 分组（anime/game/comic/vtuber 四选一）
//   description : 一句话简介
//   emoji       : 用一个表情符号代表这个角色（没有图片时显示这个）
//   image       : 图片地址（可以留空 ""，就会显示emoji）
//   votes       : 初始票数
// ============================================================

const CHARACTER_DATA = [
    {
        id: 1,
        name: "初音未来",
        anime: "VOCALOID",
        group: "vtuber",
        description: "世界上最知名的虚拟歌手，标志性的蓝绿色双马尾，永远的16岁。",
        emoji: "🎤",
        image: "",
        votes: 0
    },
    {
        id: 2,
        name: "蕾姆",
        anime: "Re:从零开始的异世界生活",
        group: "anime",
        description: "罗兹瓦尔邸的双子女仆之一，蓝发蓝眸的鬼族少女，温柔又坚强。",
        emoji: "💙",
        image: "",
        votes: 0
    },
    {
        id: 3,
        name: "灶门炭治郎",
        anime: "鬼灭之刃",
        group: "anime",
        description: "心地善良的炭烧少年，为拯救变成鬼的妹妹禰豆子而踏上战斗旅途。",
        emoji: "🔥",
        image: "",
        votes: 0
    },
    {
        id: 4,
        name: "2B (YoRHa No.2 Type B)",
        anime: "尼尔：机械纪元",
        group: "game",
        description: "YoRHa部队的二号B型战斗用人造人，冷静优雅的战士。",
        emoji: "⚔️",
        image: "",
        votes: 0
    },
    {
        id: 5,
        name: "五条悟",
        anime: "咒术回战",
        group: "anime",
        description: "东京都立咒术高专教师，当代最强咒术师，六眼与无下限术式的持有者。",
        emoji: "👁️",
        image: "",
        votes: 0
    },
    {
        id: 6,
        name: "阿尼亚·福杰",
        anime: "SPY×FAMILY 间谍过家家",
        group: "anime",
        description: "拥有读心超能力的可爱小女孩，最喜欢花生和间谍动画片，哇酷哇酷！",
        emoji: "🥜",
        image: "",
        votes: 0
    },
    {
        id: 7,
        name: "雷电将军 / 雷电影",
        anime: "原神",
        group: "game",
        description: "稻妻的雷神，追求永恒的神明，既威严又有着可爱的一面。",
        emoji: "⚡",
        image: "",
        votes: 0
    },
    {
        id: 8,
        name: "路飞 (蒙奇·D·路飞)",
        anime: "ONE PIECE 海贼王",
        group: "comic",
        description: "草帽海贼团船长，橡胶果实能力者，梦想成为海贼王的自由男人！",
        emoji: "👒",
        image: "",
        votes: 0
    },
    {
        id: 9,
        name: "洛天依",
        anime: "VOCALOID",
        group: "vtuber",
        description: "中国最具人气的虚拟歌手，灰发绿瞳的元气少女。",
        emoji: "🎵",
        image: "",
        votes: 0
    },
    {
        id: 10,
        name: "漩涡鸣人",
        anime: "火影忍者",
        group: "comic",
        description: "木叶村的超级忍者，九尾人柱力，永不放弃的热血少年，梦想成为火影！",
        emoji: "🍥",
        image: "",
        votes: 0
    },
    {
        id: 11,
        name: "钟离",
        anime: "原神",
        group: "game",
        description: "璃月往生堂客卿，真实身份是岩王帝君摩拉克斯，优雅博学但没有摩拉。",
        emoji: "🪨",
        image: "",
        votes: 0
    },
    {
        id: 12,
        name: "御坂美琴",
        anime: "某科学的超电磁炮",
        group: "anime",
        description: "学园都市排名第三的Level 5超能力者，电击使（Railgun），性格率真。",
        emoji: "⚡",
        image: "",
        votes: 0
    },
    {
        id: 13,
        name: "坂田银时",
        anime: "银魂",
        group: "anime",
        description: "万事屋老板，白夜叉，爱吃甜食、爱看JUMP，嘴上不饶人但内心温柔。",
        emoji: "🍓",
        image: "",
        votes: 0
    },
    {
        id: 14,
        name: "林克",
        anime: "塞尔达传说：王国之泪",
        group: "game",
        description: "海拉鲁的勇者，沉默寡言但勇敢无畏，永远在拯救公主的路上。",
        emoji: "🗡️",
        image: "",
        votes: 0
    },
    {
        id: 15,
        name: "藤本千空",
        anime: "Dr.STONE 石纪元",
        group: "anime",
        description: "超级天才科学少年，要用科学之力复兴全人类，唆嘎～真是令人兴奋！",
        emoji: "🧪",
        image: "",
        votes: 0
    },
    {
        id: 16,
        name: "虎杖悠仁",
        anime: "咒术回战",
        group: "anime",
        description: "吞下宿傩手指的少年，身体能力异常强大，正义感爆棚的高中生。",
        emoji: "👊",
        image: "",
        votes: 0
    }
];


// ============================================================
// 【第二部分】全局变量
// ============================================================

const MAX_DAILY_VOTES = 3;          // 每天最多投几票
let characters     = [];            // 当前角色列表（会附加实时票数）
let currentFilter  = "all";         // 当前选中的分组筛选
let remainingVotes = MAX_DAILY_VOTES; // 今天还能投几票
let votedIds       = [];            // 今天已经投过的角色id列表


// ============================================================
// 【第三部分】页面加载时执行
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    loadData();           // 从浏览器本地读取数据
    renderCards();        // 渲染角色卡片
    renderTop5();         // 渲染TOP5排行
    updateStatsBar();     // 更新顶部统计数字
    bindFilterButtons();  // 绑定筛选按钮事件
    bindSearchBox();      // 绑定搜索框事件
    bindModalClose();     // 绑定弹窗关闭按钮
});


// ============================================================
// 【第四部分】数据读取与保存
// ————————————————————————————————————————————
// 数据保存在浏览器的 localStorage 中
// 就像一个只有这个浏览器能看到的小仓库
// 关闭网页后数据不会丢失，但换浏览器/设备看不到
// ============================================================

function loadData() {
    // --- 加载角色票数 ---
    characters = CHARACTER_DATA.map(function (c) {
        return Object.assign({}, c); // 复制一份，不改原始数据
    });

    var savedVotes = localStorage.getItem("acgVoteData");
    if (savedVotes) {
        var votesMap = JSON.parse(savedVotes);
        characters.forEach(function (c) {
            if (votesMap[c.id] !== undefined) {
                c.votes = votesMap[c.id];
            }
        });
    }

    // --- 加载今日投票状态 ---
    var today     = new Date().toDateString(); // 例如 "Mon Jan 15 2024"
    var savedDate = localStorage.getItem("acgVoteDate");

    if (savedDate === today) {
        // 还是同一天，读取已投票信息
        votedIds       = JSON.parse(localStorage.getItem("acgVotedIds") || "[]");
        remainingVotes = parseInt(localStorage.getItem("acgRemaining") || MAX_DAILY_VOTES);
    } else {
        // 新的一天，重置
        localStorage.setItem("acgVoteDate", today);
        votedIds       = [];
        remainingVotes = MAX_DAILY_VOTES;
        saveVoteState();
    }
}

function saveVotes() {
    var votesMap = {};
    characters.forEach(function (c) {
        votesMap[c.id] = c.votes;
    });
    localStorage.setItem("acgVoteData", JSON.stringify(votesMap));
}

function saveVoteState() {
    localStorage.setItem("acgVotedIds",  JSON.stringify(votedIds));
    localStorage.setItem("acgRemaining", remainingVotes);
}


// ============================================================
// 【第五部分】渲染角色卡片
// ============================================================

function renderCards(list) {
    var grid = document.getElementById("character-grid");
    var data = list || getFilteredList();

    // 按票数从高到低排序
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

        // 图片或emoji占位
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
// 【第六部分】渲染 TOP 5 排行榜
// ============================================================

function renderTop5() {
    var sorted = characters.slice().sort(function (a, b) { return b.votes - a.votes; });
    var top5   = sorted.slice(0, 5);
    var maxV   = top5[0] ? top5[0].votes : 1;
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
// 【第七部分】投票处理
// ============================================================

function handleVote(charId) {
    // 检查剩余票数
    if (remainingVotes <= 0) {
        showModal("😅", "今日票数已用完", "每天最多投 " + MAX_DAILY_VOTES + " 票，明天再来吧！");
        return;
    }

    // 检查是否重复投
    if (votedIds.indexOf(charId) !== -1) {
        showModal("🤔", "重复投票", "你今天已经为这个角色投过啦！");
        return;
    }

    // 找到这个角色
    var char = null;
    for (var i = 0; i < characters.length; i++) {
        if (characters[i].id === charId) {
            char = characters[i];
            break;
        }
    }
    if (!char) return;

    // 执行投票
    char.votes++;
    remainingVotes--;
    votedIds.push(charId);

    // 保存
    saveVotes();
    saveVoteState();

    // 刷新界面
    renderCards();
    renderTop5();
    updateStatsBar();

    // 弹窗
    showModal(
        "🎉",
        "投票成功！",
        "你为「" + char.name + "」投了一票！<br>" +
        "当前票数：<strong>" + char.votes + "</strong><br>" +
        "今日剩余：<strong>" + remainingVotes + "</strong> 票"
    );
}


// ============================================================
// 【第八部分】更新顶部统计栏
// ============================================================

function updateStatsBar() {
    var total = 0;
    characters.forEach(function (c) { total += c.votes; });

    document.getElementById("total-votes").textContent      = total.toLocaleString();
    document.getElementById("total-characters").textContent  = characters.length;
    document.getElementById("remaining-votes").textContent   = remainingVotes;
}


// ============================================================
// 【第九部分】筛选 & 搜索
// ============================================================

function getFilteredList() {
    if (currentFilter === "all") return characters.slice();
    return characters.filter(function (c) { return c.group === currentFilter; });
}

function bindFilterButtons() {
    var btns = document.querySelectorAll(".filter-btn");
    btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            // 切换高亮
            btns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");

            currentFilter = btn.getAttribute("data-group");

            // 清空搜索框
            document.getElementById("search-input").value = "";

            renderCards();
        });
    });
}

function bindSearchBox() {
    var input = document.getElementById("search-input");
    input.addEventListener("input", function () {
        var kw = input.value.trim().toLowerCase();
        if (kw === "") {
            renderCards();
            return;
        }
        var results = characters.filter(function (c) {
            return c.name.toLowerCase().indexOf(kw) !== -1 ||
                   c.anime.toLowerCase().indexOf(kw) !== -1;
        });
        renderCards(results);
    });
}


// ============================================================
// 【第十部分】弹窗
// ============================================================

function showModal(icon, title, msg) {
    document.getElementById("modal-icon").textContent    = icon;
    document.getElementById("modal-title").textContent   = title;
    document.getElementById("modal-message").innerHTML    = msg;
    document.getElementById("modal-overlay").classList.add("show");
}

function bindModalClose() {
    var overlay = document.getElementById("modal-overlay");
    var btn     = document.getElementById("modal-close-btn");

    btn.addEventListener("click", function () {
        overlay.classList.remove("show");
    });

    // 点蒙层也能关闭
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.classList.remove("show");
        }
    });
}