import { BaselineExperiment, FollowupDesign, PigmentSpot } from '../types';

export const DEFAULT_PIGMENTS: PigmentSpot[] = [
  {
    id: 'carotene',
    name: '카로틴',
    chemicalName: 'β-Carotene (C40H56)',
    color: '#f59e0b', // Amber/orange
    textColor: '#78350f',
    observedRf: 0.95,
    spotCondition: '선명하고 둥근 밴드, 전선 바로 아래 위치',
    polarityRank: 1, // Most non-polar
    description: '산소 작용기가 없는 탄화수소로 극성이 거의 없어 비극성 이동상과 친화력이 가장 크고 실리카겔과의 인력이 가장 약함.',
  },
  {
    id: 'xanthophyll',
    name: '잔토필',
    chemicalName: 'Lutein / Xanthophyll (C40H56O2)',
    color: '#eab308', // Yellow
    textColor: '#713f12',
    observedRf: 0.53,
    spotCondition: '노란색 밴드, 엽록소 a와 간격이 다소 좁음',
    polarityRank: 2,
    description: '카로티노이드에 수산화기(-OH)가 결합되어 카로틴보다 극성이 높으며, 엽록소류와 실리카겔 흡착 경쟁을 벌임.',
  },
  {
    id: 'chlorophyll_a',
    name: '엽록소 a',
    chemicalName: 'Chlorophyll a (C55H72O5N4Mg)',
    color: '#059669', // Emerald blue-green
    textColor: '#064e3b',
    observedRf: 0.44,
    spotCondition: '청록색 밴드, 잔토필과 경계가 약간 중첩됨',
    polarityRank: 3,
    description: '포르피린 고리 중심에 Mg를 포함하며 3번 탄소에 메틸기(-CH3)가 있어 엽록소 b보다 극성이 낮음.',
  },
  {
    id: 'chlorophyll_b',
    name: '엽록소 b',
    chemicalName: 'Chlorophyll b (C55H70O6N4Mg)',
    color: '#65a30d', // Lime yellow-green
    textColor: '#365314',
    observedRf: 0.28,
    spotCondition: '황록색 밴드, 약간의 꼬리끌림(tailing) 관찰됨',
    polarityRank: 4, // Most polar among major 4
    description: '3번 탄소에 알데하이드기(-CHO)가 있어 강한 극성 실리카겔의 -OH기와 수소 결합 세기가 가장 강해 이동 속도가 가장 느림.',
  },
];

export const INITIAL_BASELINE_EXPERIMENT: BaselineExperiment = {
  solventSystem: '석유에테르 : 아세톤 = 9 : 1 (v/v)',
  nonPolarRatio: 9,
  polarRatio: 1,
  plateType: 'Silica gel 60 F254 (극성 고정상)',
  plateHeightCm: 10,
  solventFrontCm: 7.0,
  originCm: 1.0,
  pigments: DEFAULT_PIGMENTS,
  baselineNotes: '1차 실험에서 4개 색소는 확인되었으나, 잔토필(0.53)과 엽록소 a(0.44)의 간격이 좁아 밴드가 부분적으로 겹쳤고, 엽록소 b는 농도가 진해 아래쪽으로 약간의 번짐이 있었음.',
};

export const SAMPLE_FOLLOWUP_DESIGNS: { title: string; subtitle: string; design: FollowupDesign }[] = [
  {
    title: '설계 1: 전개용매 극성 조절 (8:2 비율)',
    subtitle: '잔토필과 엽록소의 이동성을 높여 분리도 개선을 시도하는 설계',
    design: {
      researchGoal: '1차 실험에서 좁게 분리되었던 잔토필과 엽록소 a의 밴드 간격을 넓히고 전반적인 색소 이동 양상을 개선한다.',
      hypothesis: '전개용매에서 극성 용매인 아세톤의 비율을 9:1에서 8:2로 증가시키면, 극성 색소(엽록소류, 잔토필)의 이동률이 증가하여 실리카겔과의 분리도가 향상될 것이다.',
      independentVariable: '전개용매 내 석유에테르와 아세톤의 부피비 (9:1 → 8:2)',
      dependentVariable: '각 색소의 Rf값 변화 및 잔토필과 엽록소 a 사이의 밴드 분리 간격(cm)',
      controlledVariables: 'TLC 판 재질(실리카겔), 추출액 점적 크기 및 횟수(지름 2mm 이내 5회 건조 반복), 전개 거리(7.0cm 통제), 전개 챔버 여과지 포화 상태 및 실험실 실온(22℃)',
      newSolventNonPolarRatio: 8,
      newSolventPolarRatio: 2,
      newSolventSystem: '석유에테르 : 아세톤 = 8 : 2 (v/v)',
      chamberCondition: '밀폐 챔버 내 여과지를 적셔 전개용매 증기로 15분간 사전 포화',
      experimentalPlan: '1. 석유에테르 8mL와 아세톤 2mL를 정확히 메스실린더로 취해 혼합한다.\n2. 동일한 실리카겔 TLC판의 좌측 레인에는 대조군(기존 9:1 시료)을, 우측 레인에는 실험군을 동시에 전개할 수 있도록 준비하거나 동일 조건 챔버를 병행 운용한다.\n3. 모세관으로 점적 시 스팟 지름을 2mm 미만으로 유지하고 완전히 말린 후 재점적한다.\n4. 용매 전선이 원점으로부터 7.0cm에 도달했을 때 즉시 꺼내어 연필로 전선을 표시하고 Rf값을 측정한다.',
      studentRationale: '아세톤은 극성 케톤 화합물로서 실리카겔 표면의 실란올기(-OH)와 경쟁적으로 수소 결합하여 극성 색소들이 실리카겔에 덜 흡착되게 만들므로, 극성 색소들이 더 높은 위치까지 이동할 것으로 생각했다.',
      studentRevisionNotes: '',
    },
  },
  {
    title: '설계 2: 비극성 비율 증가 (9.5 : 0.5 비율)',
    subtitle: '용매 전선 쪽으로 몰리는 카로틴과 잔토필의 정체를 지연시키는 역발상 설계',
    design: {
      researchGoal: '비극성도를 극대화하여 고정상과의 결합 차이를 더 정밀하게 유도할 수 있는지 탐구한다.',
      hypothesis: '아세톤 비율을 0.5로 줄이면 모든 색소의 Rf값이 낮아지지만, 실리카겔과의 상호작용 시간 차이가 길어져 엽록소 a와 b의 분리가 더욱 뚜렷해질 것이다.',
      independentVariable: '전개용매 아세톤 비율 감소 (석유에테르 : 아세톤 = 9.5 : 0.5)',
      dependentVariable: '엽록소 a와 b의 이동 거리 차이 및 Rf값',
      controlledVariables: '동일 시금치 추출액, 점적량(모세관 3회), 전개 챔버 크기, 전개 시간 및 거리',
      newSolventNonPolarRatio: 9.5,
      newSolventPolarRatio: 0.5,
      newSolventSystem: '석유에테르 : 아세톤 = 9.5 : 0.5 (v/v)',
      chamberCondition: '챔버 밀폐 후 즉시 전개',
      experimentalPlan: '비극성 석유에테르 9.5mL에 아세톤 0.5mL를 마이크로피펫으로 혼합하여 전개용매를 제조하고 전개한다.',
      studentRationale: '용매의 극성을 줄이면 실리카겔과의 흡착 차이가 더 오랜 시간 동안 누적되어 분리가 잘 될 것이라고 가설을 세웠다.',
      studentRevisionNotes: '',
    },
  },
];

export const SCIENTIFIC_PRINCIPLES_GUIDE = {
  title: '시금치 색소 TLC의 핵심 화학 원리',
  sections: [
    {
      heading: '1. 고정상(Stationary Phase)의 특성',
      content:
        '일반적으로 사용하는 실리카겔(Silica gel) 판은 표면에 수많은 실란올기(-Si-OH)를 노출하고 있어 매우 강한 극성을 띱니다. 따라서 극성이 강한 물질일수록 실리카겔과 강한 쌍극자-쌍극자 또는 수소 결합을 형성하여 잘 이동하지 못합니다.',
    },
    {
      heading: '2. 이동상(Mobile Phase)과 극성 비율',
      content:
        '석유에테르(비극성 탄화수소)와 아세톤(극성 케톤)의 혼합액을 사용합니다. 극성 용매(아세톤)의 비율을 높이면 용매 자체가 실리카겔 표면에 흡착되려는 힘이 커져 색소와의 흡착 경쟁에서 이기며, 극성 색소들을 더 위로 끌고 올라가 전반적인 Rf값이 증가합니다. 단, 아세톤이 과도하면 모든 색소가 용매 전선에 몰려 분리도가 급격히 떨어집니다.',
    },
    {
      heading: '3. 4대 시금치 색소의 극성 순서 (이동 속도 순서)',
      content:
        '비극성 (Rf 큼, 위쪽) : β-카로틴 > 잔토필 > 엽록소 a > 엽록소 b (Rf 작음, 아래쪽) : 극성\n• β-카로틴: 탄소와 수소로만 구성되어 극성이 없어 가장 빠르게 이동.\n• 잔토필: 양 끝에 -OH기가 있어 카로틴보다 극성이 큼.\n• 엽록소 a: -CH3기 보유.\n• 엽록소 b: -CHO(카보닐/알데하이드)기를 보유하여 극성이 더 강하고 실리카겔과 강하게 결합.',
    },
    {
      heading: '4. 변인 통제의 핵심 포인트',
      content:
        '• 조작 변인은 반드시 단 하나여야 합니다 (용매비만 바꿀 것인지, 용매 종류를 바꿀 것인지).\n• 점적 스팟 크기: 스팟이 3mm 이상으로 크거나 과농축되면 꼬리끌림(tailing)으로 인해 정확한 Rf 측정이 불가합니다.\n• 챔버 포화: 전개용매 증기가 챔버 내부에 충분히 포화되지 않으면 용매가 증발하여 가장자리 효과(edge effect)나 Rf 왜곡이 발생합니다.\n• 대조군(Control): 후속 실험 시 기존 9:1 조건과 새로운 조건을 동일 조건에서 병행 비교해야 환경 오차를 배제할 수 있습니다.',
    },
  ],
};
