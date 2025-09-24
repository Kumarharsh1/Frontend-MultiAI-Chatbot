import streamlit as st
import requests

st.set_page_config(page_title="MultiAI Chatbot", layout="wide")

st.title("🤖 MultiAI Chatbot v1.0.0")
st.markdown("Choose your assistant and start chatting!")

# Sidebar for assistant selection
assistant = st.sidebar.selectbox(
    "Select Assistant",
    ["News Assistant", "Personal Assistant", "Content Assistant", "Technical Assistant"]
)

# Input field
user_input = st.text_input("You:", "")

# Backend connection
backend_url = st.text_input("Enter backend URL", "https://backend-muliti-ai-chatbot-q2ee.vercel.app/")

if st.button("Send"):
    if user_input and backend_url:
        try:
            response = requests.post(f"{backend_url}/chat", json={"message": user_input, "assistant": assistant})
            st.markdown(f"**{assistant}**: {response.json().get('reply', 'No response')}")
        except Exception as e:
            st.error(f"Cannot connect to backend: {e}")
    else:
        st.warning("Please enter both a message and backend URL.")
