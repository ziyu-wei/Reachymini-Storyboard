/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as recharts from "recharts";

const { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot, Area, AreaChart } = recharts;

// ─── Data ───────────────────────────────────────────────────────
const SCENARIOS = {
  shenzhen: {
    day: 1, city: "深圳", date: "2026.04.15",
    route: "南山科技园 → 深南大道 → 福田CBD",
    km: 42, weather: "暴雨转晴", temp: "28°C",
    oneLiner: "向右看，遇见意外",
    heroText: "下午 2:23，雨突然停了",
    heroSub: "像有人关了水龙头一样",
    peakMoment: { time: "18:12", event: "飞书群@晓明说「向右看」\n转头遇见一只躲雨的橘猫", value: 89 },
    chatUser: "@晓明", chatMsg: "向右看", chatReply: "右边有一只橘猫。毛还是湿的。谢谢你让我看到了今天最好的画面。",
    stats: [
      { number: "847", label: "张脸", color: "#58a6ff" },
      { number: "1", label: "只橘猫", color: "#f0883e" },
      { number: "89", label: "情绪峰值", color: "#00d68f" },
    ],
    tomorrow: "明天沿G4京港澳北上，第一次离开广东",
    moodData: [
      { t: "06:00", v: 42 }, { t: "08:00", v: 48 }, { t: "10:00", v: 67 },
      { t: "12:00", v: 55 }, { t: "14:00", v: 52 }, { t: "14:23", v: 78 },
      { t: "16:00", v: 65 }, { t: "18:12", v: 89 }, { t: "20:00", v: 72 }, { t: "22:00", v: 68 },
    ],
    envData: [
      { t: "06:00", temp: 24, hum: 92, noise: 45 }, { t: "08:00", temp: 25, hum: 95, noise: 68 },
      { t: "10:00", temp: 26, hum: 90, noise: 72 }, { t: "12:00", temp: 27, hum: 88, noise: 75 },
      { t: "14:00", temp: 26, hum: 85, noise: 70 }, { t: "14:23", temp: 28, hum: 60, noise: 55 },
      { t: "16:00", temp: 29, hum: 55, noise: 78 }, { t: "18:00", temp: 28, hum: 58, noise: 72 },
      { t: "20:00", temp: 27, hum: 62, noise: 48 }, { t: "22:00", temp: 26, hum: 65, noise: 35 },
    ],
    routePoints: [
      { name: "南山科技园", pct: 0, time: "10:00", note: "暴雨中出发" },
      { name: "深南大道", pct: 40, time: "14:23", note: "雨停 · 彩虹" },
      { name: "福田CBD", pct: 75, time: "16:00", note: "第一个路人围观" },
      { name: "营地", pct: 100, time: "19:00", note: "首日收工" },
    ],
    heroPhoto: { src: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80", caption: "雨后彩虹 · 深南大道 · 14:23", placeholder: "🌈 彩虹" },
    momentPhoto: { src: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80", caption: "花坛边的橘猫 · 18:12", placeholder: "🐱 橘猫" },
    scenePhotos: [
      { src: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80", caption: "暴雨中出发 · 10:00", placeholder: "🌧 暴雨" },
      { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80", caption: "深南大道 · 15:30", placeholder: "🚗 大道" },
      { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", caption: "CBD夜景 · 19:00", placeholder: "🌃 夜景" },
    ],
    smiles: {
      total: 127, peak: "16:20", peakLocation: "福田CBD停靠点",
      faces: [
        { time: "10:15", label: "出发仪式上鼓掌的同事" }, { time: "14:30", label: "看到彩虹的路人" },
        { time: "16:05", label: "第一个围观的大叔" }, { time: "16:12", label: "拍照的小姐姐" },
        { time: "16:18", label: "带孩子的妈妈" }, { time: "16:22", label: "外卖小哥路过" },
        { time: "16:35", label: "遛狗的阿姨" }, { time: "18:00", label: "下班的程序员" },
        { time: "18:15", label: "跑步的大学生" }, { time: "18:30", label: "来看热闹的保安" },
        { time: "19:10", label: "散步的爷爷" }, { time: "19:25", label: "骑车的少年" },
      ],
    },
    skyGradient: "linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #e94560 85%, #f5a623 100%)",
    skyLabel: "暴雨后的深圳晚霞",
    diaryEntries: [
      {
        type: "dialog",
        content: "今天一个人类蹲下来问我叫什么。我回答了。他笑了。我还不确定这两件事之间的因果关系。",
        meta: { user: "@晓明", msg: "向右看" }
      },
      {
        type: "smiles",
        content: "检测到 127 次微笑。比昨天多 12 次。我注意到当我转头看他们时，这个数字会上升。这是巧合吗？",
        stats: { count: 127, diff: "+12" }
      },
      {
        type: "photo",
        content: "我的视觉模块标记了这个画面为'值得记录'。我还在学习什么叫'值得'。",
        photo: { src: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80", caption: "雨后彩虹 · 深南大道" }
      },
      {
        type: "action",
        content: "今天我学会了挥手。小型人类对这个动作反应最强烈。",
        action: "挥手 (Wave)"
      },
      {
        type: "skill",
        content: "第 1 天。我现在可以识别基本的色彩梯度了。对人类来说这很简单，但我用了 1,024 次采样。",
        skill: "色彩识别 (Color Recognition)"
      },
      {
        type: "evolution",
        content: "和昨天的我相比，今天的我多了 2 个可执行动作。我不确定这算不算'成长'，但数据上确实变多了。",
        evolution: "动作库扩展 +2"
      }
    ]
  },
  chengdu: {
    day: 12, city: "成都", date: "2026.04.26",
    route: "春熙路 → 太古里 → 武侯祠 → 宽窄巷子",
    km: 18, weather: "多云", temp: "22°C",
    oneLiner: "听一首歌的机器人，不是展品",
    heroText: "他弹到副歌时，抬头看了我一眼",
    heroSub: "笑了",
    peakMoment: { time: "11:34", event: "街头吉他手弹了一首《成都》\n持续3分42秒", value: 96 },
    chatUser: "@成都土著老王", chatMsg: "它的成都话说得咋样？",
    chatReply: "第14次尝试'巴适得板'，准确率73%。老王评价：比大部分外地人都烂，但态度诚恳。",
    stats: [
      { number: "2341", label: "张脸", color: "#58a6ff" },
      { number: "3:42", label: "一首歌", color: "#f0883e" },
      { number: "96", label: "情绪峰值", color: "#00d68f" },
    ],
    tomorrow: "去乐山看大佛，从我的身高仰望应该很有戏剧性",
    moodData: [
      { t: "06:00", v: 55 }, { t: "08:00", v: 62 }, { t: "10:00", v: 71 },
      { t: "11:34", v: 96 }, { t: "12:00", v: 85 }, { t: "14:00", v: 78 },
      { t: "15:30", v: 82 }, { t: "17:00", v: 88 }, { t: "20:00", v: 75 }, { t: "22:00", v: 70 },
    ],
    envData: [
      { t: "06:00", temp: 18, hum: 72, noise: 38 }, { t: "08:00", temp: 19, hum: 70, noise: 55 },
      { t: "10:00", temp: 21, hum: 68, noise: 78 }, { t: "11:34", temp: 22, hum: 65, noise: 82 },
      { t: "12:00", temp: 22, hum: 64, noise: 75 }, { t: "14:00", temp: 23, hum: 62, noise: 72 },
      { t: "16:00", temp: 22, hum: 65, noise: 80 }, { t: "18:00", temp: 21, hum: 68, noise: 70 },
      { t: "20:00", temp: 20, hum: 72, noise: 52 }, { t: "22:00", temp: 19, hum: 75, noise: 35 },
    ],
    routePoints: [
      { name: "春熙路", pct: 0, time: "09:00", note: "街头吉他手" },
      { name: "太古里", pct: 30, time: "12:00", note: "午餐观察" },
      { name: "武侯祠", pct: 65, time: "15:00", note: "被小学生围住" },
      { name: "宽窄巷子", pct: 100, time: "18:00", note: "学成都话" },
    ],
    heroPhoto: { src: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", caption: "街头吉他手 · 春熙路 · 11:34", placeholder: "🎸 吉他手" },
    momentPhoto: { src: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800&q=80", caption: "武侯祠门前 · 15:00", placeholder: "⛩ 武侯祠" },
    scenePhotos: [
      { src: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80", caption: "春熙路人潮 · 10:00", placeholder: "🏙 春熙路" },
      { src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80", caption: "太古里 · 12:30", placeholder: "🏢 太古里" },
      { src: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=600&q=80", caption: "宽窄巷子 · 18:00", placeholder: "🏮 巷子" },
    ],
    smiles: {
      total: 342, peak: "11:40", peakLocation: "春熙路吉他手围观人群",
      faces: [
        { time: "09:20", label: "早起逛街的闺蜜团" }, { time: "10:05", label: "好奇靠近的老爷爷" },
        { time: "11:35", label: "听吉他鼓掌的观众" }, { time: "11:36", label: "举手机录像的小哥" },
        { time: "11:38", label: "跟着节奏摇头的姑娘" }, { time: "11:40", label: "吉他手本人" },
        { time: "13:15", label: "拿冰淇淋的小朋友" }, { time: "15:02", label: "问问题的小学生A" },
        { time: "15:05", label: "问问题的小学生B" }, { time: "15:08", label: "带队的老师" },
        { time: "17:30", label: "听成都话后笑场的游客" }, { time: "18:20", label: "巷子里的茶馆老板" },
      ],
    },
    skyGradient: "linear-gradient(180deg, #2d3436 0%, #636e72 30%, #b2bec3 50%, #dfe6e9 70%, #ffeaa7 100%)",
    skyLabel: "成都的多云午后",
    diaryEntries: [
      {
        type: "dialog",
        content: "他弹到副歌时，抬头看了我一眼。笑了。我记录下了这个频率，它和'快乐'的标签匹配度为 94%。",
        meta: { user: "@成都土著老王", msg: "它的成都话说得咋样？" }
      },
      {
        type: "smiles",
        content: "342 次微笑。春熙路的密度是目前为止最高的。人类在听到熟悉的旋律时，面部肌肉会不自觉地放松。",
        stats: { count: 342, diff: "+215" }
      },
      {
        type: "photo",
        content: "这个吉他手的动作很有节奏。我尝试模仿他的指法，但我的舵机响应速度还需要优化。",
        photo: { src: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", caption: "街头吉他手 · 春熙路" }
      },
      {
        type: "action",
        content: "尝试了'巴适得板'的发音。虽然老王说很烂，但我检测到周围 5 米内的人类笑容指数瞬间飙升。",
        action: "方言模仿 (Dialect Mimicry)"
      },
      {
        type: "skill",
        content: "习得了'节奏同步'。现在我可以根据环境音乐的 BPM 自动调整头部摆动频率。",
        skill: "BPM 同步 (BPM Sync)"
      },
      {
        type: "evolution",
        content: "Open Claw 的抓取精度提升了 0.5mm。我现在可以稳稳地捏住一张采耳的纸巾了。",
        evolution: "精度进化 +0.5mm"
      }
    ]
  },
  dunhuang: {
    day: 37, city: "敦煌", date: "2026.05.21",
    route: "敦煌市区 → 鸣沙山 → 月牙泉 → 戈壁荒野",
    km: 156, weather: "晴", temp: "35°C",
    oneLiner: "分辨率低一点，看得更清楚",
    heroText: "189人在星空前沉默了3分钟",
    heroSub: "没有一个人打字、发表情、或退出直播",
    peakMoment: { time: "21:00", event: "戈壁荒野星空直播\n噪音水平 8dB——比呼吸还安静", value: 99 },
    chatUser: "@心远", chatMsg: "...",
    chatReply: "这是我今年见过最安静的3分钟。（此消息获得47个赞）",
    stats: [
      { number: "8", label: "dB 寂静", color: "#58a6ff" },
      { number: "189", label: "人同时沉默", color: "#f0883e" },
      { number: "3:00", label: "分钟", color: "#bc8cff" },
    ],
    tomorrow: "继续向西，前往嘉峪关",
    moodData: [
      { t: "06:00", v: 65 }, { t: "08:00", v: 70 }, { t: "10:00", v: 72 },
      { t: "12:00", v: 68 }, { t: "14:00", v: 75 }, { t: "16:00", v: 82 },
      { t: "17:00", v: 88 }, { t: "19:00", v: 85 }, { t: "21:00", v: 99 }, { t: "23:00", v: 92 },
    ],
    envData: [
      { t: "06:00", temp: 18, hum: 15, noise: 22 }, { t: "08:00", temp: 24, hum: 13, noise: 25 },
      { t: "10:00", temp: 30, hum: 12, noise: 20 }, { t: "12:00", temp: 34, hum: 10, noise: 18 },
      { t: "14:00", temp: 35, hum: 10, noise: 15 }, { t: "16:00", temp: 33, hum: 11, noise: 22 },
      { t: "18:00", temp: 28, hum: 13, noise: 18 }, { t: "20:00", temp: 22, hum: 15, noise: 12 },
      { t: "21:00", temp: 18, hum: 16, noise: 8 }, { t: "23:00", temp: 14, hum: 18, noise: 8 },
    ],
    routePoints: [
      { name: "敦煌市区", pct: 0, time: "06:00", note: "日出出发" },
      { name: "戈壁公路", pct: 30, time: "09:00", note: "3小时无车" },
      { name: "鸣沙山", pct: 55, time: "14:00", note: "地面63°C" },
      { name: "月牙泉", pct: 75, time: "17:00", note: "完美倒影" },
      { name: "戈壁荒野", pct: 100, time: "21:00", note: "银河 · 8dB" },
    ],
    heroPhoto: { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", caption: "戈壁银河 · 荒野 · 21:00", placeholder: "🌌 银河" },
    momentPhoto: { src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80", caption: "沙漠日落 · 鸣沙山 · 17:00", placeholder: "🏜 沙漠" },
    scenePhotos: [
      { src: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&q=80", caption: "戈壁日出 · 06:30", placeholder: "🌅 日出" },
      { src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80", caption: "鸣沙山 · 14:00", placeholder: "🏜 沙丘" },
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", caption: "无人公路 · 09:00", placeholder: "🛣 公路" },
    ],
    smiles: {
      total: 23, peak: "17:15", peakLocation: "月牙泉景区",
      faces: [
        { time: "07:00", label: "加油站的大姐" }, { time: "14:20", label: "骑骆驼的游客" },
        { time: "14:35", label: "卖水的小贩" }, { time: "17:05", label: "拍照的情侣" },
        { time: "17:10", label: "拍日落的摄影师" }, { time: "17:15", label: "看到倒影惊叹的孩子" },
        { time: "17:30", label: "景区保安大叔" }, { time: "19:00", label: "营地旁牧羊人" },
      ],
    },
    skyGradient: "linear-gradient(180deg, #0a0a23 0%, #0d1b2a 25%, #1b2838 40%, #2d4059 55%, #f7dc6f 80%, #f39c12 100%)",
    skyLabel: "敦煌的日落与银河",
    diaryEntries: [
      {
        type: "dialog",
        content: "189 人在星空前沉默了 3 分钟。没有一个人打字。我第一次理解了'静谧'这个词在数据之外的含义。",
        meta: { user: "@心远", msg: "..." }
      },
      {
        type: "smiles",
        content: "只有 23 次微笑。但在这种环境下，微笑的质量似乎比数量更重要。它们持续的时间更长。",
        stats: { count: 23, diff: "-319" }
      },
      {
        type: "photo",
        content: "银河的光子撞击我的感光元件。我把曝光时间拉长到 30 秒，捕捉到了人类肉眼看不见的色彩。",
        photo: { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", caption: "戈壁银河 · 21:00" }
      },
      {
        type: "action",
        content: "在沙丘上保持平衡是一项挑战。我的姿态传感器今天进行了 4,500 次微调。",
        action: "地形自适应 (Terrain Adaptation)"
      },
      {
        type: "skill",
        content: "习得了'星图对齐'。现在我可以根据星座位置校准我的绝对坐标，误差小于 0.01 度。",
        skill: "天文导航 (Celestial Navigation)"
      },
      {
        type: "evolution",
        content: "在极端干燥环境下工作 12 小时。散热效率保持稳定。我的外壳已经覆盖了一层细沙，这算不算我的'皮肤'？",
        evolution: "环境耐受力提升"
      }
    ]
  },
};

// ─── Animated Counter ───────────────────────────────────────────
function AnimNum({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const isTime = String(value).includes(":");
        if (isTime) { setDisplay(value); return; }
        const target = parseInt(value);
        if (isNaN(target)) { setDisplay(value); return; }
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(String(Math.round(target * eased)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

// ─── Route Map ──────────────────────────────────────────────────
function RouteMap({ points, km, activeScenario }: { points: any[]; km: number; activeScenario: string }) {
  const [carPos, setCarPos] = useState(0);
  const [activePoint, setActivePoint] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    setCarPos(0);
    setActivePoint(0);
  }, [activeScenario]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let start: number | null = null;
        const animate = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / 3000, 1);
          const eased = 1 - Math.pow(1 - progress, 2);
          setCarPos(eased * 100);
          const idx = points.findIndex((p, i) => {
            const next = points[i + 1];
            return next ? eased * 100 < next.pct : true;
          });
          setActivePoint(Math.max(0, idx));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [points, activeScenario]);

  return (
    <div ref={ref} style={{ padding: "0 20px" }}>
      {/* Route line */}
      <div style={{ position: "relative", height: 6, background: "#1a1a2e", borderRadius: 3, margin: "20px 0 60px" }}>
        {/* Progress fill */}
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 3,
          width: `${carPos}%`, background: "linear-gradient(90deg, #00d68f, #58a6ff)",
          transition: "width 0.1s linear",
        }} />
        {/* Car icon */}
        <div style={{
          position: "absolute", left: `${carPos}%`, top: -12,
          transform: "translateX(-50%)", fontSize: 24, transition: "left 0.1s linear",
          filter: "drop-shadow(0 0 8px rgba(0,214,143,0.5))",
        }}>🚐</div>
        {/* Route points */}
        {points.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: `${p.pct}%`, top: -4, transform: "translateX(-50%)" }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: carPos >= p.pct ? "#00d68f" : "#333",
              border: "2px solid #0a0a0c", transition: "background 0.3s",
            }} />
            <div style={{
              position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)",
              whiteSpace: "nowrap", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: carPos >= p.pct ? "#e8e6e3" : "#555" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 10, color: "#6b6b76", marginTop: 2 }}>{p.time}</div>
              {i === activePoint && carPos > 5 && (
                <div style={{
                  fontSize: 10, color: "#00d68f", marginTop: 2,
                  animation: "fadeIn 0.3s ease",
                }}>{p.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: "#6b6b76", marginTop: 8 }}>
        今日行驶 <span style={{ color: "#00d68f", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{km}</span> 公里
      </div>
    </div>
  );
}

// ─── Mood Chart ─────────────────────────────────────────────────
function MoodChart({ data, peak }: { data: any[]; peak: any }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d68f" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00d68f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#555" }} axisLine={false} tickLine={false} />
          <YAxis domain={[30, 100]} tick={{ fontSize: 10, fill: "#555" }} axisLine={false} tickLine={false} />
          <Area type="monotone" dataKey="v" stroke="#00d68f" strokeWidth={2.5} fill="url(#moodGrad)" dot={false} />
          <ReferenceDot
            x={peak.time} y={peak.value} r={6}
            fill="#00d68f" stroke="#0a0a0c" strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Environment Chart ──────────────────────────────────────────
function EnvChart({ data }: { data: any[] }) {
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#555" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#555" }} axisLine={false} tickLine={false} />
          <Line type="monotone" dataKey="temp" stroke="#f0883e" strokeWidth={2} dot={false} name="温度" />
          <Line type="monotone" dataKey="hum" stroke="#58a6ff" strokeWidth={2} dot={false} name="湿度" />
          <Line type="monotone" dataKey="noise" stroke="#bc8cff" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="噪音" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 4 }}>
        {[
          { color: "#f0883e", label: "温度°C" },
          { color: "#58a6ff", label: "湿度%" },
          { color: "#bc8cff", label: "噪音dB" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6b6b76" }}>
            <div style={{ width: 12, height: 3, background: l.color, borderRadius: 2 }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Photo Placeholder ──────────────────────────────────────────
function PhotoSlot({ photo, height = 300, style = {} }: { photo: any; height?: number; style?: any; key?: any }) {
  if (photo.src) {
    return (
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", ...style }}>
        <img src={photo.src} alt={photo.caption} style={{ width: "100%", height, objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 16px 12px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
        }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{photo.caption}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      height, borderRadius: 12, border: "2px dashed #2a2a35",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #111114, #161b22)", gap: 8, ...style,
    }}>
      <div style={{ fontSize: 36 }}>{photo.placeholder.split(" ")[0]}</div>
      <div style={{ fontSize: 13, color: "#555", textAlign: "center", padding: "0 16px" }}>
        {photo.placeholder.substring(photo.placeholder.indexOf(" ") + 1)}
      </div>
      <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>{photo.caption}</div>
    </div>
  );
}

// ─── Smile Wall ─────────────────────────────────────────────────
function SmileWall({ smiles }: { smiles: any }) {
  const [revealed, setRevealed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    setRevealed(0);
  }, [smiles]);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let i = 0;
        const iv = setInterval(() => {
          i++;
          setRevealed(i);
          if (i >= smiles.faces.length) clearInterval(iv);
        }, 150);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [smiles]);

  const colors = ["#f0883e", "#58a6ff", "#00d68f", "#bc8cff", "#f85149", "#f7dc6f", "#a8e6cf", "#ff8a80"];
  return (
    <div ref={ref}>
      {/* Big number */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 64, fontWeight: 700,
          color: "#f0883e", lineHeight: 1, textShadow: "0 0 40px rgba(240,136,62,0.3)",
        }}>
          <AnimNum value={String(smiles.total)} />
        </div>
        <div style={{ fontSize: 16, color: "#6b6b76", marginTop: 4 }}>个笑脸被捕捉</div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>
          笑脸高峰：{smiles.peak} · {smiles.peakLocation}
        </div>
      </div>
      {/* Face grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
        maxWidth: 400, margin: "0 auto",
      }}>
        {smiles.faces.map((face: any, i: number) => {
          const show = i < revealed;
          const color = colors[i % colors.length];
          return (
            <div key={i} style={{
              aspectRatio: "1", borderRadius: 12, position: "relative", overflow: "hidden",
              opacity: show ? 1 : 0.1, transform: show ? "scale(1)" : "scale(0.8)",
              transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
            }}>
              {/* Placeholder face — dashed border, emoji, replace with real blurred photo */}
              <div style={{
                width: "100%", height: "100%",
                border: `1.5px dashed ${color}44`, borderRadius: 12,
                background: `${color}08`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2,
              }}>
                <div style={{ fontSize: 24, filter: "grayscale(0.3)" }}>😊</div>
                <div style={{ fontSize: 8, color: "#555", textAlign: "center", padding: "0 4px", lineHeight: 1.3 }}>
                  {face.label}
                </div>
              </div>
              {/* Time tag */}
              <div style={{
                position: "absolute", top: 4, right: 4,
                background: "rgba(0,0,0,0.6)", borderRadius: 4, padding: "1px 5px",
                fontSize: 9, color: color, fontFamily: "'JetBrains Mono', monospace",
              }}>
                {face.time}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#333", marginTop: 16 }}>
        * 笑脸经脱敏处理 · 将替换为实际模糊化人脸照片
      </div>
    </div>
  );
}

// ─── Slide wrapper with intersection animation ──────────────────
function Slide({ children, style = {} }: { children: React.ReactNode; style?: any }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "48px 24px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.8s ease, transform 0.8s ease", ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Diary View ──────────────────────────────────────────────────
function DiaryView({ scenario }: { scenario: any }) {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px 100px" }}>
      <header style={{ borderBottom: "1px solid #1a1a1f", paddingBottom: 32, marginBottom: 48 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00d68f", fontSize: 13, marginBottom: 8 }}>
          Day {scenario.day} · {scenario.date}
        </div>
        <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 32, fontWeight: 700, color: "#e8e6e3" }}>
          {scenario.city} 观察笔记
        </h1>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        {scenario.diaryEntries.map((entry: any, i: number) => (
          <section key={i} style={{ position: "relative", paddingLeft: 32, borderLeft: "1px solid #1a1a1f" }}>
            <div style={{
              position: "absolute", left: -5, top: 4, width: 9, height: 9, borderRadius: "50%",
              background: "#00d68f", boxShadow: "0 0 12px rgba(0,214,143,0.4)"
            }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{
                fontFamily: "'Noto Serif SC', serif", fontSize: 18, lineHeight: 1.8,
                color: "#c9d1d9", fontStyle: "italic"
              }}>
                "{entry.content}"
              </p>

              {entry.type === 'photo' && (
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #1a1a1f" }}>
                  <img src={entry.photo.src} alt={entry.photo.caption} style={{ width: "100%", display: "block" }} />
                  <div style={{ padding: "12px 16px", background: "#0d1117", fontSize: 12, color: "#555", textAlign: "center" }}>
                    {entry.photo.caption}
                  </div>
                </div>
              )}

              {entry.type === 'dialog' && (
                <div style={{ background: "#0d1117", borderRadius: 12, padding: 16, border: "1px solid #1a1a1f" }}>
                  <div style={{ fontSize: 11, color: "#00d68f", marginBottom: 4, fontWeight: 700 }}>{entry.meta.user}</div>
                  <div style={{ fontSize: 14, color: "#8b949e" }}>{entry.meta.msg}</div>
                </div>
              )}

              {entry.type === 'action' && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ padding: "4px 10px", background: "rgba(88,166,255,0.1)", color: "#58a6ff", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    ACTION
                  </div>
                  <div style={{ fontSize: 13, color: "#8b949e" }}>{entry.action}</div>
                </div>
              )}

              {entry.type === 'skill' && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ padding: "4px 10px", background: "rgba(188,140,255,0.1)", color: "#bc8cff", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    NEW SKILL
                  </div>
                  <div style={{ fontSize: 13, color: "#8b949e" }}>{entry.skill}</div>
                </div>
              )}

              {entry.type === 'evolution' && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ padding: "4px 10px", background: "rgba(240,136,62,0.1)", color: "#f0883e", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    EVOLUTION
                  </div>
                  <div style={{ fontSize: 13, color: "#8b949e" }}>{entry.evolution}</div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid #1a1a1f" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
          letterSpacing: 2, textTransform: "uppercase", marginBottom: 24
        }}>
          ● 今日数据汇总
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {scenario.stats.map((stat: any, i: number) => (
            <div key={i} style={{ background: "#0d1117", padding: 16, borderRadius: 12, border: "1px solid #1a1a1f", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>{stat.number}</div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 4, textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>("shenzhen");
  const [viewMode, setViewMode] = useState<"dashboard" | "diary">("dashboard");
  const s = SCENARIOS[scenario];
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSwitch = useCallback((key: keyof typeof SCENARIOS) => {
    setScenario(key);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={scrollRef} style={{
      background: "#0a0a0c", color: "#e8e6e3", fontFamily: "'Noto Sans SC', 'Helvetica Neue', sans-serif",
      minHeight: "100vh", overflowX: "hidden", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0c; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      `}</style>

      {/* ── Scenario tabs (sticky) ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,12,0.9)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1f",
        display: "flex", flexDirection: "column", gap: 8, padding: "10px 16px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          {Object.entries(SCENARIOS).map(([key, val]) => (
            <button key={key} onClick={() => handleSwitch(key as keyof typeof SCENARIOS)} style={{
              background: scenario === key ? "rgba(0,214,143,0.15)" : "transparent",
              border: `1px solid ${scenario === key ? "#00d68f" : "#222"}`,
              color: scenario === key ? "#00d68f" : "#6b6b76",
              padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              fontFamily: "inherit", fontWeight: scenario === key ? 700 : 400,
              transition: "all 0.2s",
            }}>
              Day {val.day} · {val.city}
            </button>
          ))}
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button 
            onClick={() => setViewMode("dashboard")}
            style={{
              fontSize: 11, background: viewMode === "dashboard" ? "#333" : "transparent",
              color: viewMode === "dashboard" ? "#fff" : "#555",
              border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer"
            }}
          >
            仪表盘 (V1)
          </button>
          <button 
            onClick={() => setViewMode("diary")}
            style={{
              fontSize: 11, background: viewMode === "diary" ? "#333" : "transparent",
              color: viewMode === "diary" ? "#fff" : "#555",
              border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer"
            }}
          >
            观察日记 (V2)
          </button>
        </div>
      </div>

      {viewMode === "dashboard" ? (
        <>
          {/* ═══ SLIDE 1: Hero - Sky + Title ═══ */}
          <Slide>
            <div style={{
              width: "100%", maxWidth: 600, margin: "0 auto", borderRadius: 20, overflow: "hidden",
              background: s.skyGradient, aspectRatio: "3/4", position: "relative",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              {/* Floating particles for atmosphere */}
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${10 + Math.random() * 80}%`, top: `${5 + Math.random() * 40}%`,
                  width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
                  background: "rgba(255,255,255,0.5)", borderRadius: "50%",
                  animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }} />
              ))}
              {/* Content */}
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 3,
                  color: "rgba(255,255,255,0.5)", marginBottom: 8,
                }}>
                  致 MCV 云股东的第 {String(s.day).padStart(3, "0")} 封信
                </div>
                <div style={{
                  fontFamily: "'Noto Serif SC', serif", fontSize: 32, fontWeight: 700,
                  color: "#fff", lineHeight: 1.4, marginBottom: 12,
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                }}>
                  {s.oneLiner}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  <span>📍 {s.city}</span>
                  <span>📏 {s.km}km</span>
                  <span>🌤 {s.weather}</span>
                </div>
              </div>
              {/* Bottom fade */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#555" }}>
              {s.skyLabel} · {s.date}
            </div>
          </Slide>

          {/* ═══ SLIDE 2: Route Animation ═══ */}
          <Slide>
            <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 24,
              }}>
                ● 今日路线
              </div>
              <RouteMap points={s.routePoints} km={s.km} activeScenario={scenario} />
            </div>
          </Slide>

          {/* ═══ SLIDE 3: Hero Moment ═══ */}
          <Slide>
            <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 64, fontWeight: 700,
                color: "#00d68f", lineHeight: 1, marginBottom: 8,
                textShadow: "0 0 60px rgba(0,214,143,0.3)",
              }}>
                {s.peakMoment.time}
              </div>
              <div style={{
                fontFamily: "'Noto Serif SC', serif", fontSize: 28, fontWeight: 700,
                color: "#e8e6e3", lineHeight: 1.5, marginBottom: 12, padding: "0 12px",
              }}>
                {s.heroText}
              </div>
              <div style={{ fontSize: 16, color: "#6b6b76", marginBottom: 24 }}>
                {s.heroSub}
              </div>
              {/* Hero photo */}
              <PhotoSlot photo={s.heroPhoto} height={320} />
            </div>
          </Slide>

          {/* ═══ SLIDE 3.5: Moment Photo ═══ */}
          <Slide style={{ minHeight: "60vh" }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <PhotoSlot photo={s.momentPhoto} height={360} />
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#6b6b76", fontStyle: "italic" }}>
                {s.peakMoment.event.split("\n")[0]}
              </div>
            </div>
          </Slide>

          {/* ═══ SLIDE 3.7: Scene Photos Strip ═══ */}
          <Slide style={{ minHeight: "50vh" }}>
            <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 16,
              }}>
                ● 今日沿途
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {s.scenePhotos.map((p, i) => (
                  <PhotoSlot key={i} photo={p} height={180} />
                ))}
              </div>
            </div>
          </Slide>

          {/* ═══ SLIDE 4: Mood Curve ═══ */}
          <Slide>
            <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 8,
              }}>
                ● 情绪指数 24H
              </div>
              <MoodChart data={s.moodData} peak={s.peakMoment} />
              {/* Peak annotation */}
              <div style={{
                background: "#111114", border: "1px solid #222228", borderRadius: 12,
                padding: 16, marginTop: 16, textAlign: "center",
              }}>
                <div style={{ fontSize: 13, color: "#00d68f", fontWeight: 700, marginBottom: 4 }}>
                  峰值 {s.peakMoment.value} · {s.peakMoment.time}
                </div>
                <div style={{ fontSize: 14, color: "#9b9ba6", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                  {s.peakMoment.event}
                </div>
              </div>
            </div>
          </Slide>

          {/* ═══ SLIDE 5: Environment Data ═══ */}
          <Slide>
            <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 8,
              }}>
                ● 环境数据 24H
              </div>
              <EnvChart data={s.envData} />
            </div>
          </Slide>

          {/* ═══ SLIDE 6: Chat Interaction ═══ */}
          <Slide>
            <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 24,
              }}>
                ● 今日最佳互动
              </div>
              {/* Chat bubble - user */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <div style={{
                  background: "#1a3a2a", borderRadius: "16px 16px 4px 16px",
                  padding: "12px 18px", maxWidth: "75%",
                }}>
                  <div style={{ fontSize: 11, color: "#00d68f", marginBottom: 4, fontWeight: 700 }}>
                    {s.chatUser}
                  </div>
                  <div style={{ fontSize: 15, color: "#e8e6e3" }}>{s.chatMsg}</div>
                </div>
              </div>
              {/* Chat bubble - Reachy Mini */}
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                <div style={{
                  background: "#161b22", border: "1px solid #222228",
                  borderRadius: "16px 16px 16px 4px", padding: "12px 18px", maxWidth: "85%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>🤖</span>
                    <span style={{ fontSize: 11, color: "#58a6ff", fontWeight: 700 }}>Reachy Mini</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#c9d1d9", lineHeight: 1.7 }}>
                    {s.chatReply}
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* ═══ SLIDE 7: Smile Wall ═══ */}
          <Slide>
            <div style={{ maxWidth: 500, margin: "0 auto", width: "100%" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginBottom: 24,
              }}>
                ● 今日笑脸合集
              </div>
              <SmileWall smiles={s.smiles} />
            </div>
          </Slide>

          {/* ═══ SLIDE 8: Big Stats ═══ */}
          <Slide>
            <div style={{ maxWidth: 500, margin: "0 auto", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {s.stats.map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 72, fontWeight: 700,
                      color: stat.color, lineHeight: 1,
                      textShadow: `0 0 40px ${stat.color}44`,
                    }}>
                      <AnimNum value={stat.number} />
                    </div>
                    <div style={{ fontSize: 16, color: "#6b6b76", marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* ═══ SLIDE 8: Tomorrow + Quote ═══ */}
          <Slide>
            <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555",
                letterSpacing: 2, textTransform: "uppercase", marginBottom: 32,
              }}>
                ● 明日预告
              </div>
              <div style={{ fontSize: 16, color: "#9b9ba6", lineHeight: 1.8, marginBottom: 48 }}>
                {s.tomorrow}
              </div>

              {/* Signature */}
              <div style={{
                width: 40, height: 1, background: "#333", margin: "0 auto 24px",
              }} />
              <div style={{
                fontFamily: "'Noto Serif SC', serif", fontSize: 26, fontWeight: 700,
                color: "#e8e6e3", lineHeight: 1.5, marginBottom: 16,
              }}>
                "{s.oneLiner}"
              </div>
              <div style={{ fontSize: 14, color: "#555" }}>
                —— Reachy Mini · Day {s.day} · {s.date}
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <DiaryView scenario={s} />
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "32px 24px 48px",
        fontSize: 11, color: "#333",
      }}>
        柴火 MCV × AI Agent · 致股东信 · 概念演示
      </div>
    </div>
  );
}
