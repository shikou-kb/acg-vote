/* ============================================================
   db.js —— Supabase 云数据库操作
   
   【作用】
   这个文件负责和 Supabase 云数据库通信：
   - 读取所有角色的实时票数（所有人共享）
   - 提交投票（写入数据库）
   - 检查今天是否已投过（防止重复投票）
   ============================================================ */

// ============================================================
// 🔴🔴🔴 把下面两行改成你自己的 Supabase 项目凭证 🔴🔴🔴
// （在 Supabase 控制台 → Project Settings → API 中查看）
// ============================================================
var SUPABASE_URL  = 'https://tccwccqncstamrloikvq.supabase.co';       // 例如: https://abcdefg.supabase.co
var SUPABASE_KEY  = 'sb_publishable_V75aink_bVOOrT9xiSkW7g_vm99k9jM';  // 例如: eyJhbGciOi...（很长一串）
// ============================================================

var MAX_DAILY_VOTES = 3; // 每天最多投几票

// 初始化 Supabase 客户端
var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ----------------------------------------------------------
// 获取/生成访客唯一标识
// 存在浏览器 localStorage 中，用来标识"同一个人"
// ----------------------------------------------------------
function getVisitorId() {
    var vid = localStorage.getItem('moe_visitor_id');
    if (!vid) {
        vid = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
        localStorage.setItem('moe_visitor_id', vid);
    }
    return vid;
}

// ----------------------------------------------------------
// 从数据库读取所有角色的票数
// 返回格式：{ 1: 25, 2: 18, 3: 42, ... }（角色ID: 票数）
// ----------------------------------------------------------
async function dbFetchVotes() {
    try {
        var result = await sb
            .from('char_votes')
            .select('char_id, votes');

        if (result.error) {
            console.error('读取票数失败:', result.error);
            return {};
        }

        var map = {};
        if (result.data) {
            result.data.forEach(function (row) {
                map[row.char_id] = row.votes;
            });
        }
        return map;
    } catch (err) {
        console.error('读取票数异常:', err);
        return {};
    }
}

// ----------------------------------------------------------
// 查询当前访客今天的投票情况
// 返回：{ votedIds: [1, 3], remaining: 1 }
// ----------------------------------------------------------
async function dbFetchTodayInfo() {
    try {
        var visitorId = getVisitorId();
        var today = new Date().toISOString().split('T')[0]; // "2025-07-15"

        var result = await sb
            .from('vote_logs')
            .select('char_id')
            .eq('visitor_id', visitorId)
            .eq('vote_date', today);

        if (result.error) {
            console.error('读取投票状态失败:', result.error);
            return { votedIds: [], remaining: MAX_DAILY_VOTES };
        }

        var votedIds = (result.data || []).map(function (row) {
            return row.char_id;
        });
        var remaining = Math.max(0, MAX_DAILY_VOTES - votedIds.length);

        return { votedIds: votedIds, remaining: remaining };
    } catch (err) {
        console.error('读取投票状态异常:', err);
        return { votedIds: [], remaining: MAX_DAILY_VOTES };
    }
}

// ----------------------------------------------------------
// 提交一次投票
// 参数：charId —— 角色ID（数字）
// 返回：{ success, message, newVotes, remaining }
// ----------------------------------------------------------
async function dbSubmitVote(charId) {
    try {
        var visitorId = getVisitorId();
        var today = new Date().toISOString().split('T')[0];

        // ---- 检查1：今天是否已经投过这个角色 ----
        var checkResult = await sb
            .from('vote_logs')
            .select('id')
            .eq('visitor_id', visitorId)
            .eq('char_id', charId)
            .eq('vote_date', today)
            .limit(1);

        if (checkResult.data && checkResult.data.length > 0) {
            return { success: false, message: '你今天已经给这个角色投过票了' };
        }

        // ---- 检查2：今天总投票次数是否超限 ----
        var countResult = await sb
            .from('vote_logs')
            .select('id', { count: 'exact', head: true })
            .eq('visitor_id', visitorId)
            .eq('vote_date', today);

        var todayCount = countResult.count || 0;
        if (todayCount >= MAX_DAILY_VOTES) {
            return { success: false, message: '今日投票次数已用完（每天最多' + MAX_DAILY_VOTES + '票）' };
        }

        // ---- 写入投票记录 ----
        var logResult = await sb
            .from('vote_logs')
            .insert({
                char_id:    charId,
                visitor_id: visitorId,
                vote_date:  today
            });

        if (logResult.error) {
            console.error('写入投票记录失败:', logResult.error);
            return { success: false, message: '投票记录写入失败: ' + logResult.error.message };
        }

        // ---- 调用原子递增函数，更新角色票数 ----
        var rpcResult = await sb.rpc('increment_vote', { cid: charId });

        if (rpcResult.error) {
            console.error('更新票数失败:', rpcResult.error);
            return { success: false, message: '票数更新失败: ' + rpcResult.error.message };
        }

        var newVotes    = rpcResult.data;           // 函数返回的新票数
        var newRemaining = Math.max(0, MAX_DAILY_VOTES - todayCount - 1);

        return {
            success:   true,
            message:   '投票成功！',
            newVotes:  newVotes,
            remaining: newRemaining
        };

    } catch (err) {
        console.error('投票异常:', err);
        return { success: false, message: '网络错误，请稍后再试: ' + err.message };
    }
}