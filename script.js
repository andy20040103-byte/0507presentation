// --- Modal Logic ---
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    if(id === 'modal-roleplay') {
        resetRoleplay();
    }
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
            if(modal.id === 'modal-roleplay') resetRoleplay();
        }
    });
}

// --- Intersection Observer for Fade-In ---
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

// --- Purpose Tabs ---
function showPurpose(targetId) {
    document.querySelectorAll('.purpose-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.purpose-content').forEach(content => content.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
}

// --- Multi-turn Role-Play Engine ---
const gameData = {
    doctor: {
        turn1: {
            npc: "【家屬 志明】醫師！我女兒大腿那麼腫，是不是你們護理師漏針害的？而且她血小板那麼低，為什麼不趕快給她輸血小板？",
            choices: [
                { text: "A. 「真的很抱歉，我們會去調查護理師。既然血小板很低，我們馬上幫她輸注血小板讓數字好看一點。」", next: "turn2_A" },
                { text: "B. 「腫脹有一部分是因為腫瘤本身。我們不能輸血小板，腫瘤會把它吃掉並加速長大。我們必須立刻開始口服抗排斥藥。」", next: "turn2_B" },
                { text: "C. 「我是醫師還是你是醫師？如果你想害死她，好啊我幫你輸血。」", next: "turn2_C" }
            ]
        },
        turn2_A: {
            system: "⚠️ 警告：輸注血小板後，腫瘤迅速脹大且變硬。",
            npc: "【家屬 春嬌】天啊！大腿更腫了！你們到底會不會治？我不要吃什麼有副作用的藥了，直接幫她開刀切掉！",
            choices: [
                { text: "A. 「好，既然你們堅持，我們馬上照會外科來開刀。」", next: "end_bad_surgery" },
                { text: "B. 「開刀風險太高了，我們真的必須吃藥控制。」", next: "turn3_A1" },
                { text: "C. 「現在不准再吵開刀！如果不馬上吃這款特效藥，她隨時會內出血致死，這是現在唯一的活路！」", next: "turn3_A2" }
            ]
        },
        turn3_A1: {
            npc: "【家屬 志明】你這庸醫，剛才輸血就出事了，我才不信你！我們要轉院！",
            choices: [
                { text: "A. 「真的很抱歉，我們會協助辦理轉院手續...」", next: "end_transfer" },
                { text: "B. 「請你們冷靜一點聽我說...」", next: "end_ignore" },
                { text: "C. 「要轉就轉吧。」", next: "end_rude" }
            ]
        },
        turn3_A2: {
            npc: "【家屬 春嬌】(嚇到哭出來)...那吃了藥真的會好嗎？我們真的很怕...",
            choices: [
                { text: "A. 「一定會好的，我保證！」", next: "end_overpromise" },
                { text: "B. 「只要發燒立刻回來急診，我們團隊會全天候待命處理副作用，請相信我們。」", next: "end_firm_save" },
                { text: "C. 「誰也無法保證，生死有命。」", next: "end_cold" }
            ]
        },
        turn2_B: {
            system: "💡 提示：家屬聽到『不能輸血』加上『抗排斥藥』，感到極度抗拒。",
            npc: "【家屬 志明】抗排斥藥？那不是器官移植在吃的嗎？她才剛出生你要給她吃這種破壞免疫力的藥？",
            choices: [
                { text: "A. 「如果不吃，她隨時會腦出血死亡！這不是討價還價的時候，立刻簽名！」", next: "turn3_B1" },
                { text: "B. 「這藥聽起來可怕，但它能直接讓腫瘤停止『吃』血小板。這是一場拔河，我們會嚴密監控。」", next: "turn3_B2" },
                { text: "C. 「你自己去 Google 查論文啦，我門診還有 50 個病人。」", next: "end_dispute" }
            ]
        },
        turn3_B1: {
            npc: "【家屬 春嬌】你這醫生怎麼這樣講話... 難道沒有別的辦法了嗎？我們真的很怕感染...",
            choices: [
                { text: "A. 「我語氣比較重是因為這真的很危險，請你們相信醫療團隊，我們會一起度過難關。」", next: "end_firm_good" },
                { text: "B. 「沒有別的辦法，不簽名就帶回家等死。」", next: "end_broken" },
                { text: "C. 「不然我們貼個 OK 繃就好了？」", next: "end_joke" }
            ]
        },
        turn3_B2: {
            npc: "【家屬 志明】可是吃那個藥如果發燒感染怎麼辦？我們真的很怕照顧不來...",
            choices: [
                { text: "A. 「只要發燒立刻回來急診，我們團隊會全天候待命，不要太擔心。」", next: "end_empathy_good" },
                { text: "B. 「只要把保溫箱消毒乾淨就不會感染啦，你們太緊張了。」", next: "end_overpromise" },
                { text: "C. 「那就讓她發燒啊，總比流血死掉好。」", next: "end_bad_manner" }
            ]
        },
        turn2_C: {
            system: "❌ 醫療糾紛爆發！家屬將對話錄音並向衛生局投訴。",
            npc: null, choices: []
        },

        // Doctor Endings
        end_bad_surgery: { system: "❌ 致命結局：過度順從家屬。在 KMP 凝血極差的狀態下動刀，導致無法控制的大出血致死。", npc: null, choices: []},
        end_transfer: { system: "⚠️ 悲慘結局：家屬失去信任辦理轉院。在轉院途中極可能發生大出血。", npc: null, choices: []},
        end_ignore: { system: "⚠️ 失敗結局：家屬完全聽不進去，拒絕配合治療。", npc: null, choices: []},
        end_rude: { system: "❌ 醫病關係破裂：你失去了救治病人的機會。", npc: null, choices: []},
        end_overpromise: { system: "⚠️ 潛在危機結局：過度保證。後續若有任何副作用，家屬會認為你騙了他們而提告。", npc: null, choices: []},
        end_firm_save: { system: "✅ 驚險挽救：雖然一開始做錯決定，但透過強硬且具支持性的警告，成功拉回正軌。", npc: null, choices: []},
        end_cold: { system: "⚠️ 冷漠結局：家屬勉強簽字，但心中充滿恐懼與不滿。", npc: null, choices: []},
        end_dispute: { system: "❌ 醫療糾紛：傲慢的態度直接引爆家屬怒火。", npc: null, choices: []},
        end_firm_good: { system: "✅ 絕佳結果：雖然語氣強硬，但適時展現了醫療團隊的擔當，成功建立威信與信任。", npc: null, choices: []},
        end_broken: { system: "❌ 悲慘結局：家屬崩潰，帶病危的女兒回家。", npc: null, choices: []},
        end_joke: { system: "🤡 搞笑結局：家屬以為你在開玩笑，立刻轉院。", npc: null, choices: []},
        end_empathy_good: { system: "✅ 完美結局：你用溫和但堅定的態度，成功建立了堅實的醫病夥伴關係。", npc: null, choices: []},
        end_bad_manner: { system: "❌ 糟糕的床邊態度：家屬對你完全失去信心。", npc: null, choices: []}
    },

    family: {
        turn1: {
            npc: "【主治醫師】小玫瑰得的是罕見的 KHE 腫瘤合併 KMP。我建議立刻開始服用 Sirolimus (免疫抑制劑)，這會讓她容易感染，需要防範肺炎。",
            choices: [
                { text: "A. 「她才剛出生，我不能讓她吃這種破壞免疫力的毒藥。我們帶回家觀察。」", next: "turn2_A" },
                { text: "B. 「只要能救她，我們願意吃藥。請教我們該怎麼照顧。」", next: "turn2_B" },
                { text: "C. 「可以用精油療法或喝符水治好嗎？」", next: "turn2_C" }
            ]
        },
        turn2_A: {
            system: "⚠️ 警告：三天後，小玫瑰出現大量瘀斑，血小板跌破一萬。",
            npc: "【主治醫師】情況非常危急！不吃藥的話隨時會腦出血。你們確定還要觀察嗎？",
            choices: [
                { text: "A. 「不管啦，我寧願去別家醫院開刀切掉！」", next: "turn3_A1" },
                { text: "B. 「我錯了，拜託立刻給她吃藥！」", next: "turn3_A2" },
                { text: "C. 「不如我們去拜拜？」", next: "end_temple" }
            ]
        },
        turn3_A1: {
            npc: "【主治醫師】現在開刀有極高的致死大出血風險，外科醫師不會同意的！",
            choices: [
                { text: "A. 「那我不管，我不相信你們醫院了，我要轉院！」", next: "end_fatal_delay" },
                { text: "B. 「那...那我們聽你的，趕快給藥吧。」", next: "end_late_start" },
                { text: "C. 「那我自己幫她切。」", next: "end_absurd_cut" }
            ]
        },
        turn3_A2: {
            npc: "【主治醫師】我們立刻投藥，但因為延誤，需要同時進入加護病房插管觀察。",
            choices: [
                { text: "A. 「只要能活下來，插管也沒關係。」", next: "end_survived" },
                { text: "B. 「插管太痛苦了，還是不要好了...」", next: "end_fatal_refusal" },
                { text: "C. 「那可以順便幫她割雙眼皮嗎？」", next: "end_absurd_eye" }
            ]
        },
        turn2_B: {
            system: "💡 提示：吃藥兩週後，血小板回升，但小玫瑰突然發高燒到 39 度。",
            npc: "【內心獨白】天啊！醫師說過吃這藥容易感染，是不是藥物害的？",
            choices: [
                { text: "A. 「這藥太危險了，我們立刻自行停藥！」", next: "turn3_B1" },
                { text: "B. 「立刻帶回急診，告訴醫師她正在吃免疫抑制劑，請團隊評估。」", next: "turn3_B2" },
                { text: "C. 「給她吃冰淇淋退燒。」", next: "end_icecream" }
            ]
        },
        turn3_B1: {
            npc: "【主治醫師】(回診時) 你怎麼可以擅自停藥！現在腫瘤又變大了，血小板再次狂跌！",
            choices: [
                { text: "A. 「對不起...請再救救她...」", next: "end_rebound_save" },
                { text: "B. 「停藥是對的，發燒很危險啊！」", next: "end_fatal_rebound" },
                { text: "C. 「我有給她吃退燒藥，應該沒事吧？」", next: "end_rebound_ignorant" }
            ]
        },
        turn3_B2: {
            npc: "【急診醫師】抽血顯示有輕微肺炎，需要住院打抗生素，那免疫抑制劑還要繼續吃嗎？",
            choices: [
                { text: "A. 「配合血液腫瘤科醫師指示，調整劑量繼續吃。」", next: "end_best_care" },
                { text: "B. 「住院好可怕，我們回家自己照顧。」", next: "end_infection" },
                { text: "C. 「把抗生素跟符水混在一起喝。」", next: "end_absurd_water" }
            ]
        },
        turn2_C: {
            system: "🤡 搞笑結局：醫師無語地看著你。小玫瑰的病情被延誤了。",
            npc: null, choices: []
        },

        // Family Endings
        end_fatal_delay: { system: "❌ 致命結局：在極低血小板狀態下轉院，途中發生大出血致死。", npc: null, choices: []},
        end_late_start: { system: "⚠️ 驚險結局：勉強保住一命，但因為初期逃避，小玫瑰多受了很多折磨。", npc: null, choices: []},
        end_absurd_cut: { system: "🤡 搞笑結局：你被請出了醫院。", npc: null, choices: []},
        end_survived: { system: "⚠️ 驚險結局：經歷插管等重症治療後，情況終於穩定。", npc: null, choices: []},
        end_fatal_refusal: { system: "❌ 悲慘結局：拒絕急救，失去了生命。", npc: null, choices: []},
        end_absurd_eye: { system: "🤡 搞笑結局：醫師請精神科來會診你。", npc: null, choices: []},
        end_temple: { system: "🤡 搞笑結局：神明託夢叫你聽醫生的話。", npc: null, choices: [] },
        end_icecream: { system: "🤡 搞笑結局：嬰兒不能吃冰淇淋！", npc: null, choices: [] },
        end_rebound_save: { system: "⚠️ 驚險結局：腫瘤強烈反撲，治療必須從頭來過。慢性腫瘤需要長期抗戰，千萬不能擅自停藥！", npc: null, choices: []},
        end_fatal_rebound: { system: "❌ 致命結局：因為固執擅自停藥，導致腫瘤急速長大壓迫器官致死。", npc: null, choices: []},
        end_rebound_ignorant: { system: "⚠️ 驚險結局：無知的代價是讓小玫瑰面臨了生死交關的腫瘤反撲。", npc: null, choices: []},
        end_best_care: { system: "✅ 最佳照護典範：成功控制感染，並維持住腫瘤的治療。這是真實病房中最期望家屬做出的正確反應！", npc: null, choices: []},
        end_infection: { system: "❌ 致命結局：免疫力低下又逃避住院，導致嚴重敗血症。", npc: null, choices: []},
        end_absurd_water: { system: "🤡 搞笑結局：符水沒有科學根據喔！", npc: null, choices: []}
    }
};

let currentRole = '';
let currentTurn = '';
const historyDiv = document.getElementById('dialogue-history');
const choicesDiv = document.getElementById('choices-container');
const resetBtn = document.getElementById('reset-rp-btn');

function initRoleplay(role) {
    document.getElementById('rp-start').classList.add('hidden');
    document.getElementById('rp-game').classList.remove('hidden');
    currentRole = role;
    currentTurn = 'turn1';
    historyDiv.innerHTML = '';
    renderTurn();
}

function renderTurn() {
    const node = gameData[currentRole][currentTurn];
    choicesDiv.innerHTML = '';

    // Add System Message if any
    if (node.system) {
        historyDiv.innerHTML += `<div class="chat-bubble chat-system">${node.system}</div>`;
    }

    // Add NPC Message if any
    if (node.npc) {
        historyDiv.innerHTML += `<div class="chat-bubble chat-npc">${node.npc}</div>`;
    }

    // Add Choices or End Game
    if (node.choices && node.choices.length > 0) {
        node.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = choice.text;
            btn.onclick = () => makeChoice(choice.text, choice.next);
            choicesDiv.appendChild(btn);
        });
    } else {
        // End of game
        resetBtn.classList.remove('hidden');
    }
    
    // Auto scroll to bottom
    setTimeout(() => {
        historyDiv.scrollTop = historyDiv.scrollHeight;
    }, 50);
}

function makeChoice(text, nextNode) {
    // Show user choice in history
    historyDiv.innerHTML += `<div class="chat-bubble chat-player">${text}</div>`;
    
    currentTurn = nextNode;
    renderTurn();
}

function resetRoleplay() {
    document.getElementById('rp-game').classList.add('hidden');
    document.getElementById('rp-start').classList.remove('hidden');
    resetBtn.classList.add('hidden');
}
