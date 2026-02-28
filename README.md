# Customer Churn Prediction & Agentic Retention Strategy
## From Predictive Analytics to Intelligent Intervention
### Project Overview

Customer churn is one of the biggest challenges telecom companies face today. Losing a customer isn't just about one cancelled subscription; it snowballs into lost revenue, higher acquisition costs, and a weakened brand. This project tackles that problem head on by building an AI powered system that not only predicts which customers are likely to leave, but eventually evolves into an intelligent agent that can suggest personalized retention strategies.

We worked with the **Telco Customer Churn** dataset, which captures real world customer behavior like how long they've been with the company, what services they use, how much they pay, and whether or not they ended up churning. The goal was to dig into this data, find meaningful patterns, and train a model that can flag at risk customers before it's too late.

**Milestone 1** focuses on classical machine learning. We used techniques like Logistic Regression along with thoughtful feature engineering to build a churn prediction pipeline. The results are served through a clean, interactive Streamlit dashboard where users can explore the data visually and even test predictions for individual customers.

**Milestone 2** takes things further by introducing an agent based AI layer. The idea here is to move beyond just predicting churn and actually reason about it. Using frameworks like LangGraph and retrieval augmented generation (RAG), the system will pull in retention best practices and generate structured intervention plans tailored to each customer's situation.