export interface Example {
	name: string;
	desc: string;
	src: string;
}
export interface Section {
	title: string;
	note: string;
	examples: Example[];
}

export const sections: Section[] = [
	{
		title: 'Supported by all three',
		note: 'The core grammars every renderer draws: flowchart, sequence, state, class, ER.',
		examples: [
			{
				name: 'flowchart',
				desc: 'nodes, branches, edge labels',
				src: `flowchart TD
  A[Parse source] --> B{Supported?}
  B -->|yes| C[Lay out]
  B -->|no| D[Framed source]
  C --> E[Unicode art]
  D --> E`
			},
			{
				name: 'subgraph',
				desc: 'nested titled frames, cycles',
				src: `flowchart TD
  In[Request] --> R
  subgraph svc [Service]
    R[Router] --> H1[Handler A]
    R --> H2[Handler B]
  end
  H1 --> Out[(Store)]
  H2 --> Out
  Out -.->|retry| In`
			},
			{
				name: 'sequence',
				desc: 'participants, messages, notes',
				src: `sequenceDiagram
  participant U as User
  participant T as Terminal
  participant R as Renderer
  U->>T: mermaid source
  T->>R: render()
  R-->>T: unicode art
  Note over U,T: pretty boxes`
			},
			{
				name: 'state',
				desc: 'transitions, start/end markers',
				src: `stateDiagram-v2
  [*] --> Idle
  Idle --> Parsing: source arrives
  Parsing --> Drawing: parse ok
  Parsing --> Framed: parse fails
  Drawing --> [*]
  Framed --> [*]`
			},
			{
				name: 'class',
				desc: 'compartments, members, relations',
				src: `classDiagram
  class MermaidArt {
    +plain: string[]
    +styled: Span[][]
    +width: number
    +warnings: string[]
  }
  class Span {
    +text: string
    +role: Role
  }
  MermaidArt "1" --> "*" Span : rows of`
			},
			{
				name: 'er',
				desc: 'entities, relations, attributes',
				src: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  CUSTOMER {
    string name
    int loyalty
  }`
			}
		]
	},
	{
		title: 'Where grok-mermaid and lovely-mermaid diverge',
		note:
			'lovely-mermaid started as a byte-faithful port of the grok-build renderer, then deliberately diverged: ' +
			'lenient parsing, class styles, composite states, frontmatter, grapheme-correct widths.',
		examples: [
			{
				name: 'styles',
				desc: ':::class + classDef colors — grok-mermaid ignores them, lovely-mermaid applies them',
				src: `flowchart TD
  A[Request]:::hot --> B{Authorized?}
  B -->|yes| C[Serve]:::ok
  B -->|no| D[401 Denied]:::err
  C --> E[(Cache)]
  class E cold
  classDef hot fill:#ff9966,color:#000000
  classDef ok stroke:#22a06b,color:#22a06b
  classDef err fill:#8b0000,color:#ffdddd
  classDef cold fill:lightblue,color:#000000,font-weight:bold`
			},
			{
				name: 'composite',
				desc: 'nested states — grok-mermaid flattens them, lovely-mermaid frames them',
				src: `stateDiagram-v2
  [*] --> Idle
  Idle --> Active
  state Active {
    [*] --> Fetching
    Fetching --> Rendering
    Rendering --> Fetching : retry
    --
    Log --> Flush
  }
  Active --> [*]`
			},
			{
				name: 'title',
				desc: 'YAML frontmatter — grok-mermaid mistakes it for the header and refuses',
				src: `---
title: Deploy pipeline
---
flowchart LR
  Build --> Test
  Test --> Ship
  Ship --> Done`
			},
			{
				name: 'activations',
				desc: 'lifeline activations — grok-mermaid strips the +/- markers',
				src: `sequenceDiagram
  Client->>+Server: request
  Server->>+DB: query
  DB-->>-Server: rows
  Server-->>-Client: response`
			},
			{
				name: 'cardinalities',
				desc: 'ER aliases + cardinalities at their edge ends — grok-mermaid refuses the alias, folds the cardinalities',
				src: `erDiagram
  c["Credit Card"] {
    string number
  }
  c |o--|| CUSTOMER : "pays with"
  CUSTOMER ||--o{ ORDER : places`
			},
			{
				name: 'links',
				desc: 'click/link URLs — lovely-mermaid emits OSC 8 terminal hyperlinks, grok-mermaid has no click',
				src: `flowchart LR
  A[lovely-mermaid] --> B[GitHub]
  A --> C[npm]
  click B "https://github.com/xl0/lovely-mermaid"
  click C "https://www.npmjs.com/package/lovely-mermaid"`
			},
			{
				name: 'emoji',
				desc: 'grapheme clusters — grok-mermaid overflows boxes on ZWJ emoji',
				src: `flowchart LR
  A[你好世界] --> B[👨‍👩‍👧 family]
  B --> C[🚀 Launch]
  C --> D[Done ✅]`
			},
			{
				name: 'broken',
				desc: 'a half-typed source — mermaid errors, grok-mermaid salvages, lovely-mermaid renders the prefix + warns',
				src: `flowchart TD
  A[Start --> B
  C --> `
			}
		]
	},
	{
		title: 'New in lovely-mermaid',
		note: 'Diagram types the grok-build renderer never had. grok-mermaid returns null for all of these.',
		examples: [
			{
				name: 'pie',
				desc: 'proportions as a labelled bar list',
				src: `pie showData title Render targets
  "Terminals" : 62
  "TUIs" : 25
  "CI logs" : 13`
			},
			{
				name: 'mindmap',
				desc: 'indentation tree with TUI guides',
				src: `mindmap
  root((lovely-mermaid))
    Parsing
      Lenient
      Streaming
    Layout
      Sugiyama
      Lanes
    Output
      Roles
      Classes`
			},
			{
				name: 'timeline',
				desc: 'periods and events, sections',
				src: `timeline
  title Project history
  section Port
  2026-07 : Byte-faithful port : Differential harness
  section Redesign
  2026-08 : Lenient parsing : Semantic spans
          : New diagram types`
			},
			{
				name: 'gitgraph',
				desc: 'commit lanes, git log --graph style',
				src: `gitGraph
  commit id: "scaffold"
  branch feature
  commit id: "parse"
  checkout main
  commit id: "docs"
  merge feature tag: "v1.0"
  commit id: "polish"`
			}
		]
	},
	{
		title: 'Only mermaid draws these',
		note: 'Grammars neither terminal renderer supports (yet) — both return null.',
		examples: [
			{
				name: 'gantt',
				desc: 'time-scaled task bars',
				src: `gantt
  title Release plan
  dateFormat YYYY-MM-DD
  section Port
  Byte-faithful port :done, a, 2026-07-01, 20d
  Differential harness :done, b, after a, 10d
  section Redesign
  Lenient parsing :active, c, 2026-08-01, 10d
  New diagram types : d, after c, 14d`
			},
			{
				name: 'journey',
				desc: 'user journey with scored steps',
				src: `journey
  title Render a diagram
  section Author
    Write mermaid: 5: User
    Paste into terminal: 3: User
  section Machine
    Parse: 5: Renderer
    Draw boxes: 5: Renderer`
			},
			{
				name: 'quadrant',
				desc: 'quadrant chart',
				src: `quadrantChart
  title Renderer landscape
  x-axis Text --> Pixels
  y-axis Static --> Interactive
  quadrant-1 Browsers
  quadrant-2 Terminals
  quadrant-3 Logs
  quadrant-4 Notebooks
  mermaid.js: [0.8, 0.8]
  lovely-mermaid: [0.2, 0.35]
  grok-mermaid: [0.15, 0.2]`
			}
		]
	}
];
