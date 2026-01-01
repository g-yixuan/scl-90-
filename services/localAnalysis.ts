import { AssessmentResult, GeneratedReport, InterpretationData, DimensionReport } from '../types';

// The provided JSON data
const RULES: InterpretationData = {
  "meta_info": {
    "app_name": "心灵小憩补给站",
    "version": "1.0",
    "description": "SCL-90 积木式话术库 - 温暖治愈版"
  },
  "global_assessment": {
    "title": "心灵体检总评",
    "levels": [
      {
        "min": 0, "max": 1.5, // Adjusted min to 0 to catch everything below 1.5
        "label": "🌞 晴空万里",
        "text": "你的心灵花园目前阳光充足，土壤肥沃。虽然生活中难免有小波澜，但你有足够的力量去冲浪。请继续保持这种积极、平衡的生活状态！"
      },
      {
        "min": 1.5, "max": 2.5,
        "label": "☁️ 多云转阴",
        "text": "最近是不是觉得有点累？心灵的天空飘来了一些乌云，虽然还在可控范围内，但这也许是身体在提醒你：“嘿，该歇歇脚了。” 试着放慢一点节奏吧。"
      },
      {
        "min": 2.5, "max": 3.5,
        "label": "🌧️ 连绵阴雨",
        "text": "这段时间你可能正在经历一场心灵的雨季，压力、焦虑或低落的情绪像潮湿的空气一样包围着你。这并不是你的错，只是你的心灵负荷有点重了。在这个补给站，我们希望能为你撑一把伞。"
      },
      {
        "min": 3.5, "max": 6.0, // Adjusted max to 6 to catch everything above 3.5
        "label": "⛈️ 暴雨雷鸣",
        "text": "现在的你可能正处在一段非常艰难的黑暗隧道中，狂风暴雨让你感到无助甚至绝望。请记住，这只是暂时的气象，不是你人生的全部。但此刻，你非常需要专业人士（医生或咨询师）的帮助来带你走出风暴。"
      }
    ]
  },
  "dimensions": [
    {
      "id": "somatization",
      "original_name": "躯体化",
      "display_name": "身体共鸣度",
      "desc": "反映身体对心理压力的生理反应，如头痛、背痛等。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "身心轻盈", "content": "你的身体感觉很轻松，没有什么不明原因的不适感。", "advice": "继续保持运动，享受身体的活力。" },
        { "min": 1.5, "max": 2.5, "status": "略感疲惫", "content": "身体偶尔会发出一些小抗议，比如酸痛或不适，这通常是压力的投影。", "advice": "睡个好觉，或者做一次全身按摩放松一下。" },
        { "min": 2.5, "max": 3.5, "status": "身体沉重", "content": "身体似乎承受了较重的负担，你可能经常感到头痛、胸闷或身体不适。这是身体在替你的情绪喊累。", "advice": "除了检查身体，更要关注情绪出口，尝试瑜伽或腹式呼吸。" },
        { "min": 3.5, "max": 6.0, "status": "极度紧绷", "content": "强烈的不适感可能已经影响了你的生活，身体正在拉响警报。", "advice": "建议前往医院排除器质性病变，同时求助心理医生处理躯体化症状。" }
      ]
    },
    {
      "id": "obsessive_compulsive",
      "original_name": "强迫症状",
      "display_name": "思维秩序感",
      "desc": "反映那些明知没有必要，但无法摆脱的无意义思想或冲动。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "思维通畅", "content": "你的思维很灵活，做事专注但不会钻牛角尖。", "advice": "保持这种收放自如的心态。" },
        { "min": 1.5, "max": 2.5, "status": "偶尔纠结", "content": "有时候你会反复检查某些事情，或者脑海里有些念头挥之不去，稍微有点累心。", "advice": "告诉自己“差不多就可以了”，试着接受一点点不完美。" },
        { "min": 2.5, "max": 3.5, "status": "陷入循环", "content": "你可能常常陷入思维的死循环，明明知道没必要，却停不下来。这种内耗让你感到疲惫。", "advice": "当强迫思维出现时，试着喊“停”，并转移注意力到当下的动作上。" },
        { "min": 3.5, "max": 6.0, "status": "思维枷锁", "content": "强迫性的念头或行为可能已经占据了你大量的时间，让你感到痛苦。", "advice": "认知行为疗法（CBT）对你会有很大帮助，请寻求专业咨询。" }
      ]
    },
    {
      "id": "interpersonal_sensitivity",
      "original_name": "人际关系敏感",
      "display_name": "社交舒适度",
      "desc": "反映在人际交往中的不自在感和自卑感。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "社交自信", "content": "你在人群中感到自在，与人相处时心态平和。", "advice": "享受你的人际关系，你是受欢迎的。" },
        { "min": 1.5, "max": 2.5, "status": "在意他人", "content": "偶尔你会过分在意别人的眼光，或者担心自己说错话。", "advice": "其实大家都在关注自己，没那么多人盯着你，放轻松。" },
        { "min": 2.5, "max": 3.5, "status": "社交紧绷", "content": "在人际交往中你可能感到很不自在，总觉得别人在议论你或不喜欢你，想逃离人群。", "advice": "试着从这里开始建立自信，你不需要讨好任何人，做自己就很好。" },
        { "min": 3.5, "max": 6.0, "status": "社交恐惧", "content": "与人接触对你来说可能是一种折磨，极度的敏感让你倾向于封闭自己。", "advice": "这是一个需要被呵护的创伤点，专业的心理咨询能帮你重建安全感。" }
      ]
    },
    {
      "id": "depression",
      "original_name": "抑郁",
      "display_name": "情绪能量值",
      "desc": "反映苦闷的情感和心境，动力不足。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "能量充沛", "content": "你的情绪像小太阳一样温暖，对生活充满兴趣。", "advice": "把你的快乐分享给身边的人吧！" },
        { "min": 1.5, "max": 2.5, "status": "情绪低落", "content": "最近是不是开心的事情变少了？偶尔的emo是正常的情绪潮汐。", "advice": "去晒晒太阳，吃点甜食，允许自己短暂的低落。" },
        { "min": 2.5, "max": 3.5, "status": "情绪感冒", "content": "低落、无力感困扰你有一段时间了，生活仿佛失去了色彩，做什么都提不起劲。", "advice": "这不是你的错，是心灵感冒了。请务必找信任的朋友倾诉，不要独自硬撑。" },
        { "min": 3.5, "max": 6.0, "status": "至暗时刻", "content": "你可能正承受着巨大的痛苦，觉得未来没有希望，甚至有过放弃的念头。", "advice": "警告：请立刻停止独处，拨打心理危机干预热线或前往医院。你对我们很重要，请活下去。" }
      ]
    },
    {
      "id": "anxiety",
      "original_name": "焦虑",
      "display_name": "内心松弛度",
      "desc": "反映游离不定的焦虑及惊恐发作。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "内心宁静", "content": "你的内心像平静的湖面，安稳而从容。", "advice": "保持这种松弛感，这是现代人稀缺的财富。" },
        { "min": 1.5, "max": 2.5, "status": "偶尔紧张", "content": "面对压力时你会感到紧张、坐立不安，这是正常的应激反应。", "advice": "深呼吸，数到10，告诉自己“这只是暂时的”。" },
        { "min": 2.5, "max": 3.5, "status": "紧绷不安", "content": "你可能经常感到莫名的恐惧或心跳加速，神经像拉紧的弦，无法放松。", "advice": "尝试冥想或正念练习，把关注点拉回到“当下”，而不是担忧“未来”。" },
        { "min": 3.5, "max": 6.0, "status": "惊恐状态", "content": "极度的焦虑可能让你感到窒息或濒死感，严重影响了生活。", "advice": "药物治疗配合心理咨询是缓解焦虑的有效手段，请尽快就医。" }
      ]
    },
    {
      "id": "hostility",
      "original_name": "敌对",
      "display_name": "愤怒平复力",
      "desc": "反映厌烦、摔物、争论直到不可控制的脾气爆发。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "平和包容", "content": "你很友善，很少因为琐事发脾气。", "advice": "你的温和是你的人格魅力。" },
        { "min": 1.5, "max": 2.5, "status": "容易急躁", "content": "遇到不顺心的事，你容易感到烦躁或想发火。", "advice": "感觉火气上来时，先离开现场3分钟，给情绪降降温。" },
        { "min": 2.5, "max": 3.5, "status": "易怒体质", "content": "你可能经常感到难以控制的怒火，甚至想摔东西或与人争吵。这其实是内心脆弱的防御。", "advice": "拳击运动或书写日记是很好的宣泄方式，不要把攻击性指向自己或亲人。" },
        { "min": 3.5, "max": 6.0, "status": "失控边缘", "content": "频繁的冲动和敌意可能正在破坏你的人际关系。", "advice": "专业的愤怒管理课程或心理咨询能帮你找到怒火背后的原因。" }
      ]
    },
    {
      "id": "phobic_anxiety",
      "original_name": "恐怖",
      "display_name": "安全感边界",
      "desc": "反映对特定场所、交通工具或事物的恐惧。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "无畏前行", "content": "你对周围环境有很好的安全感。", "advice": "继续勇敢地探索世界吧。" },
        { "min": 1.5, "max": 2.5, "status": "特定回避", "content": "你可能害怕某些特定的东西（如高处、人群），但不影响大局。", "advice": "接纳这些小恐惧，它们是人类的生存本能。" },
        { "min": 2.5, "max": 3.5, "status": "恐惧受限", "content": "对某些场景的恐惧让你不敢出门或回避社交，生活圈子因此变窄。", "advice": "系统脱敏法是治疗恐惧的良药，可以尝试在安全环境下一点点接触恐惧源。" },
        { "min": 3.5, "max": 6.0, "status": "极度惊恐", "content": "强烈的恐惧感让你寸步难行，甚至出现惊恐发作。", "advice": "请寻求医生帮助，你不需要活在惊吓中。" }
      ]
    },
    {
      "id": "paranoid_ideation",
      "original_name": "偏执",
      "display_name": "信任过滤器",
      "desc": "反映猜疑、妄想、被动体验和夸大等。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "信任开放", "content": "你愿意相信他人，看待世界的方式很客观。", "advice": "信任是连接他人的桥梁，保持这份豁达。" },
        { "min": 1.5, "max": 2.5, "status": "略多疑虑", "content": "偶尔你会觉得别人话里有话，或者因为得不到信任而感到委屈。", "advice": "试着进行直接沟通，而不是在心里猜谜语。" },
        { "min": 2.5, "max": 3.5, "status": "敏感多疑", "content": "你可能总觉得别人在针对你、利用你，这种戒备心让你活得很累。", "advice": "这是内心缺乏安全感的表现。试着卸下一点点盔甲，不是所有人都带有恶意。" },
        { "min": 3.5, "max": 6.0, "status": "四面楚歌", "content": "你深信周围环境充满敌意，这种想法严重扭曲了你的现实体验。", "advice": "这可能涉及到深层的认知偏差，需要专业的医疗介入来帮你重建信任感。" }
      ]
    },
    {
      "id": "psychoticism",
      "original_name": "精神病性",
      "display_name": "内心独处感",
      "desc": "反映疏离感、生活方式退缩、孤僻等。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "现实连接", "content": "你与现实世界连接紧密，归属感强。", "advice": "继续积极参与生活。" },
        { "min": 1.5, "max": 2.5, "status": "偶尔游离", "content": "有时候你会觉得孤独，或者觉得这个世界有点陌生，想一个人静静。", "advice": "享受独处是能力，但也要记得回来和朋友聚聚。" },
        { "min": 2.5, "max": 3.5, "status": "疏离孤僻", "content": "你可能感觉自己像个局外人，难以融入群体，甚至觉得自己的想法没人能懂。", "advice": "这种孤独感可以通过艺术、写作来表达。如果感到太孤单，请尝试加入志趣相投的小圈子。" },
        { "min": 3.5, "max": 6.0, "status": "现实脱节", "content": "你可能感到思维混乱，或者感觉被某种力量控制，分不清现实与幻觉。", "advice": "这是一条红色警报，表明精神压力极大，请立即前往精神专科就诊。" }
      ]
    },
    {
      "id": "additional",
      "original_name": "其他",
      "display_name": "生活节律",
      "desc": "反映睡眠、饮食等基础生理需求。",
      "levels": [
        { "min": 0, "max": 1.5, "status": "吃香睡好", "content": "你的睡眠和胃口都很棒，基础能量满格。", "advice": "身体是革命的本钱，继续保持！" },
        { "min": 1.5, "max": 2.5, "status": "节律微乱", "content": "最近可能睡得不太踏实，或者胃口一般。", "advice": "睡前少看手机，喝杯热牛奶，调整一下作息。" },
        { "min": 2.5, "max": 3.5, "status": "寝食难安", "content": "入睡困难、早醒或暴饮暴食/厌食正在困扰你。基础节律的紊乱会让情绪更糟糕。", "advice": "优先解决睡眠问题，必要时可以使用助眠药物（遵医嘱）。" },
        { "min": 3.5, "max": 6.0, "status": "节律崩溃", "content": "严重的睡眠剥夺或饮食问题已经让你心力交瘁。", "advice": "请把“好好睡觉、好好吃饭”当作目前的头等大事，做不到请立即就医。" }
      ]
    }
  ]
};

// Map App constants keys to JSON keys
const KEY_MAP: Record<string, string> = {
  'somatization': 'somatization',
  'ocd': 'obsessive_compulsive',
  'interpersonal': 'interpersonal_sensitivity',
  'depression': 'depression',
  'anxiety': 'anxiety',
  'hostility': 'hostility',
  'phobic': 'phobic_anxiety',
  'paranoid': 'paranoid_ideation',
  'psychoticism': 'psychoticism',
  'others': 'additional'
};

export const generateAssessmentReport = (result: AssessmentResult): GeneratedReport => {
  // 1. Global Assessment
  const globalScore = result.globalSeverityIndex;
  const globalLevel = RULES.global_assessment.levels.find(
    l => globalScore >= l.min && globalScore < l.max
  ) || RULES.global_assessment.levels[RULES.global_assessment.levels.length - 1];

  // 2. Dimensions
  const dimensions: DimensionReport[] = result.factorResults.map(factor => {
    const jsonKey = KEY_MAP[factor.factorKey];
    const rule = RULES.dimensions.find(d => d.id === jsonKey);
    
    if (!rule) {
      // Fallback if rule not found
      return {
        key: factor.factorKey,
        name: factor.factorName,
        displayName: factor.factorName,
        score: factor.averageScore,
        status: "未知",
        content: "暂无详细解读。",
        advice: "请关注此维度的得分。",
        severityLevel: 1
      };
    }

    const score = factor.averageScore;
    // Find matching level. Note: Max is exclusive in find logic usually, but here ranges are continuous.
    // We treat the last bucket as inclusive of the max or higher.
    const levelIndex = rule.levels.findIndex(l => score >= l.min && score < l.max);
    const safeLevelIndex = levelIndex === -1 ? rule.levels.length - 1 : levelIndex; // Default to highest if out of bound (unlikely with max 6)
    
    const level = rule.levels[safeLevelIndex];

    return {
      key: factor.factorKey,
      name: factor.factorName,
      displayName: rule.display_name,
      score: score,
      status: level.status || "",
      content: level.content || "",
      advice: level.advice || "",
      severityLevel: safeLevelIndex + 1 // 1-based level for UI styling
    };
  });

  // 3. Crisis Warning Logic
  // Trigger if Global > 3.5 OR Depression > 3.5 OR Psychoticism > 3.5
  // Or simply if any dimension hits the highest level (index 3, which is 3.5+)
  const hasSevereDimension = dimensions.some(d => d.severityLevel >= 4);
  const isGlobalSevere = globalScore >= 3.5;
  const crisisWarning = isGlobalSevere || hasSevereDimension;

  return {
    globalAssessment: {
      label: globalLevel.label || "",
      text: globalLevel.text || "",
      levelIndex: RULES.global_assessment.levels.indexOf(globalLevel)
    },
    dimensions,
    crisisWarning
  };
};
