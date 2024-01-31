import json
import openai
import os

# OpenAI Keys
openai.organization = "org-4syK5rpvVR7nABjSceLGim9e"
openai.api_key = os.environ["OPENAI_API_KEY"]

# Calls GPT-4
def get_response(system_prompt, user_prompt):
  # OpenAI request
  response = openai.ChatCompletion.create(
      model="gpt-4",
      messages = [
         {"role": "system", "content": system_prompt},
         {"role": "user", "content": user_prompt},
      ],
      temperature=0,
  )
  # The response
  whole_message = response['choices'][0]['message']['content']

  first_index = whole_message.find("```") + 7
  last_index = whole_message.find("```", first_index + 1)

  final_message = whole_message[first_index:last_index]
  new_data = json.loads(final_message)
  make_file(new_data)

def make_file(new_data):
  # Makes a JSON file called boxes.json which contains the response from GPT
  with open("boxes.json", "w") as outfile:
      json.dump(new_data, outfile)

def get_user_content(topic):
  topic_dict = {"calc": 'APCalcABBCPrompt.txt', 
                "lang": 'APLangPrompt.txt', 
                "CSA": 'APComputerScienceAPrompt.txt', 
                "world": 'APWorldHistoryPrompt.txt',
                "chem": 'APChemistryPrompt.txt',
                "bio": 'APBiologyPrompt.txt'
                }
  
  file = topic_dict[topic]
  with open(file, "r") as f:
    user_prompt = f.readline()
  with open('SystemPrompt.txt', "r") as s:
    system_prompt = s.readline()
  f.close
  s.close
  get_response(system_prompt, user_prompt)

get_user_content("calc")