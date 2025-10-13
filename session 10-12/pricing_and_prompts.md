# Pricing and Prompts (Sessions 10–12)

## A. Pricing Research
Date of research: YYYY-MM-DD
Sources checked: (list URLs / provider docs)
Summary table:
  | Model | Billing unit | Cost (per unit) | Notes |
  |-------|--------------|-----------------|-------|
  | Gemini-X | per 1k tokens | $X.XX | e.g., best for short prompts |
  | ... | ... | ... | ... |

## B. Cost Estimation Examples
Example call 1: 
Example call 2: 

## C. Prompt Refinement — Before / After
Student A

Bad prompt (before):


What can I do about my high blood pressure?

Bad Prompt Observation:

The response to “What can I do about my high blood pressure?” is likely vague or generic, potentially giving unsafe or incomplete advice without clear structure or actionable steps.


Refined prompt (after) [RTFC applied]:


Role: Certified Health Coach AI

Task: Suggest practical lifestyle strategies to help manage high blood pressure

Format: Numbered list of actionable tips focusing on diet, exercise, and habits

Constraint: Do not provide prescriptions; advise consulting a healthcare professional for medication guidance

Refined Prompt Observation:

The refined prompt produces structured, practical, and safe recommendations, with a friendly tone and step-by-step guidance on diet, exercise, sleep, and stress management.

Notes: Provides safe, actionable guidance without risking giving medical prescriptions.

Student B

Bad prompt (before):
My child has a fever and cough. What should I do?

Bad Prompt Observation:
The response to “My child has a fever and cough” is likely to be lengthy, unstructured, and possibly overwhelming for parents. It may include detailed medical explanations, risk sounding like a diagnosis, and lack clear, quick-to-follow steps for home care.

Refined prompt (after) [RTFC applied]:
Role: Pediatric Health Advisor
Task: Suggest safe, general steps parents can take for a child with fever and cough
Format: Bullet points with practical home care tips and warning signs
Constraint: Do not provide a medical diagnosis; always recommend consulting a pediatrician if symptoms persist or worsen

Refined Prompt Observation:
The refined prompt produces a well-organized, parent-friendly response that clearly separates home care tips from warning signs. It focuses on comfort, hydration, and safety while emphasizing when to seek professional help. The guidance is structured, concise, and responsibly avoids medical prescriptions or diagnostic claims.

Notes:
Provides safe, easy-to-understand advice with clear boundaries; encourages consulting healthcare professionals for any serious or persistent symptoms.

Student C
Bad prompt (before):


I feel tired all the time, what’s wrong with me?


Refined prompt (after) [RTFC applied]:


Role: General Health Consultant

Task: Explain possible general reasons for persistent fatigue and lifestyle factors that could contribute

Format: Short numbered list highlighting common causes and practical tips

Constraint: Avoid diagnosing; advise consulting a healthcare professional for proper evaluation

[Paste user symptoms here]


Notes: Focuses on educational guidance, making the output informative and safe, rather than giving potentially incorrect medical conclusions.


Response Contrast: 
The bad prompt response lists causes of fatigue : lifestyle, medical conditions, and medications without actionable guidance, making it informative but less practical. The good prompt response pairs each cause with clear, actionable tips, emphasizes common lifestyle factors, and maintains a supportive, user-friendly tone. Overall, the good response is solution-focused and easier to read, while the bad response is mainly descriptive.

Student D
Bad Prompt (before):

I have stomach pain after eating, what is it?
Bad Prompt Observation:

This question is too vague and open-ended. It may lead the model to generate unstructured or overly general responses, possibly drifting into medical diagnosis instead of providing safe, useful guidance. There’s no defined role, format, or safety constraint.


Refined Prompt (after) [RTFC applied]:

Role: Nutrition and Health Assistant

Task: Provide possible general reasons for post-meal stomach pain and tips for relief

Format: Bullet points, include dietary considerations and red-flag symptoms

Constraint: Do not diagnose; recommend seeing a doctor if pain is severe or persistent
Refined Prompt Observation:

The refined prompt yields a clear, structured, and responsible response. It provides general causes, practical relief strategies, and highlights warning signs while maintaining a non-diagnostic, educational tone.
Notes:

Gives balanced, factual, and safe information in an organized format, ensuring clarity and ethical response boundaries.