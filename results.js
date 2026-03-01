/* ============================================================
   ACG角色人气投票 —— 结果页逻辑 (results.js)
   ============================================================ */

// 和 main.js 中一样的角色基础数据
// （为了让 results.html 能独立运行，这里再写一份）
var BASE_DATA = [
    { id:1,  name:"初音未来",       anime:"VOCALOID",              group:"vtuber",  emoji:"🎤", votes:0 },
    { id:2,  name:"蕾姆",           anime:"Re:从零开始的异世界生活", group:"anime",   emoji:"💙", votes:0 },
    { id:3,  name:"灶门炭治郎",     anime:"鬼灭之刃",              group:"anime",   emoji:"🔥", votes:0 },
    { id:4,  name:"2B",             anime:"尼尔：机械纪元",         group:"game",    emoji:"⚔️", votes:0  },
    { id:5,  name:"五条悟",         anime:"咒术回战",               group:"anime",   emoji:"👁️", votes:0 },
    { id:6,  name:"阿尼亚·福杰",   anime:"间谍过家家",             group:"anime",   emoji:"🥜", votes:0 },
    { id:7,  name:"雷电将军",       anime:"原神",                   group:"game",    emoji:"⚡", votes:0 },
    { id:8,  name:"路飞",           anime:"ONE PIECE 海贼王",       group:"comic",   emoji:"👒", votes:0 },
    { id:9,  name:"洛天依",         anime:"VOCALOID",              group:"vtuber",  emoji:"🎵", votes:0  },
    { id:10, name:"漩涡鸣人",       anime:"火影忍者",               group:"comic",   emoji:"🍥", votes:0 },
    { id:11, name:"钟离",           anime:"原神",                   group:"game",    emoji:"🪨", votes:0  },
    { id:12, name:"御坂美琴",       anime:"某科学的超电磁炮",       group:"anime",   emoji:"⚡", votes:0  },
    { id:13, name:"坂田银时",       anime:"银魂",                   group:"anime",   emoji:"🍓", votes:0 },
    { id:14, name:"林克",           anime:"塞尔达传说",             group:"game",    emoji:"🗡️", votes:0  },
    { id:15, name:"藤本千空",       anime:"Dr.STONE 石纪元",       group:"anime",   emoji:"🧪", votes:0  },
    { id:16, name:"虎杖悠仁",       anime:"咒术回战",               group:"anime",   emoji:"👊", votes:0  }
];

// 分组的中文名映射
var GROUP_LABELS = {
    anime:  "🎬 动画",
    game:   "🎮 游戏",
    comic:  "📚 漫画",
    vtuber: "🎤 虚拟歌手"
};

// 图表配色
var CHART_COLORS = [
    "#e94560", "#ff6b81", "#533483", "#7c5cbf",
    "#0f3460", "#1a5276", "#ffd700", "#f39c12",
    "#2ecc71", "#1abc9c", "#e67e22", "#e74c3c",
    "#9b59b6", "#3498db", "#1dd1a1", "#ff9ff3"
];


// ============================================================
// 页面加载时执行
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    var characters = loadCharacterData();
    drawBarChart(characters);
    drawPieChart(characters);
    drawRankingTable(characters);
});


// ============================================================
// 从 localStorage 读取最新票数
// ============================================================

function loadCharacterData() {
    // 复制基础数据
    var data = BASE_DATA.map(function (c) {
        return { id: c.id, name: c.name, anime: c.anime, group: c.group, emoji: c.emoji, votes: c.votes };
    });

    // 读取本地保存的票数（和 main.js 共用同一个 key）
    var saved = localStorage.getItem("acgVoteData");
    if (saved) {
        var map = JSON.parse(saved);
        data.forEach(function (c) {
            if (map[c.id] !== undefined) {
                c.votes = map[c.id];
            }
        });
    }

    // 按票数降序排列
    data.sort(function (a, b) { return b.votes - a.votes; });
    return data;
}


// ============================================================
// 柱状图 —— TOP 10
// ============================================================

function drawBarChart(characters) {
    var top10  = characters.slice(0, 10);
    var labels = top10.map(function (c) { return c.emoji + " " + c.name; });
    var values = top10.map(function (c) { return c.votes; });
    var colors = top10.map(function (_, i) { return CHART_COLORS[i]; });

    var ctx = document.getElementById("barChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "票数",
                data: values,
                backgroundColor: colors,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: "y",                // 横向柱状图
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#141430",
                    titleColor: "#e94560",
                    bodyColor: "#fff",
                    padding: 12,
                    cornerRadius: 8,
                    borderColor: "#e94560",
                    borderWidth: 1,
                    callbacks: {
                        label: function (ctx) {
                            return " " + ctx.raw.toLocaleString() + " 票";
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks:  { color: "#8888aa" },
                    grid:   { color: "rgba(255,255,255,0.04)" }
                },
                y: {
                    ticks:  { color: "#f0f0f0", font: { size: 13 } },
                    grid:   { display: false }
                }
            }
        }
    });
}


// ============================================================
// 环形图 —— 分组占比
// ============================================================

function drawPieChart(characters) {
    // 按分组汇总票数
    var groupTotals = {};
    characters.forEach(function (c) {
        groupTotals[c.group] = (groupTotals[c.group] || 0) + c.votes;
    });

    var labels = Object.keys(groupTotals).map(function (k) { return GROUP_LABELS[k] || k; });
    var values = Object.values(groupTotals);
    var colors = ["#e94560", "#533483", "#0f3460", "#ffd700"];

    var ctx = document.getElementById("pieChart").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: "#0a0a1a",
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#f0f0f0",
                        padding: 18,
                        font: { size: 14 },
                        usePointStyle: true,
                        pointStyleWidth: 12
                    }
                },
                tooltip: {
                    backgroundColor: "#141430",
                    titleColor: "#e94560",
                    bodyColor: "#fff",
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (ctx) {
                            var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                            var pct   = ((ctx.raw / total) * 100).toFixed(1);
                            return " " + ctx.raw.toLocaleString() + " 票 (" + pct + "%)";
                        }
                    }
                }
            }
        }
    });
}


// ============================================================
// 排名表格
// ============================================================

function drawRankingTable(characters) {
    var tbody = document.getElementById("rank-tbody");
    var total = 0;
    characters.forEach(function (c) { total += c.votes; });

    var html = "";
    characters.forEach(function (c, idx) {
        var rank = idx + 1;
        var pct  = total > 0 ? ((c.votes / total) * 100).toFixed(1) : "0.0";

        // 排名样式
        var rankDisplay, rankClass;
        if      (rank === 1) { rankDisplay = "🥇"; rankClass = "gold";   }
        else if (rank === 2) { rankDisplay = "🥈"; rankClass = "silver"; }
        else if (rank === 3) { rankDisplay = "🥉"; rankClass = "bronz";  }
        else                 { rankDisplay = "#" + rank; rankClass = "";  }

        var groupLabel = GROUP_LABELS[c.group] || c.group;

        html += '' +
            '<tr>' +
                '<td class="col-rank ' + rankClass + '">' + rankDisplay + '</td>' +
                '<td>' + c.emoji + ' <strong>' + c.name + '</strong></td>' +
                '<td>《' + c.anime + '》</td>' +
                '<td>' + groupLabel + '</td>' +
                '<td><strong>' + c.votes.toLocaleString() + '</strong></td>' +
                '<td class="col-bar">' +
                    pct + '%' +
                    '<div class="mini-bar"><div class="mini-bar-fill" style="width:' + pct + '%"></div></div>' +
                '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
}