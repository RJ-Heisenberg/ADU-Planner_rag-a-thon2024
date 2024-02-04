import json

from llama_index.llms import OpenAI
from llama_index.agent import ReActAgent
from llama_index.tools import FunctionTool
from .tools import (
    extract_city_state_pair_from_address,
    get_building_codes_digest_for_city_state_pair,
    query_building_codes_digest,
)


_QUERY = """
Given the address: {address}

Answer ALL questions below using the local building codes:
- What is the minimum floor area for detached ADUs?
- What is the maximum floor area for detached ADUs?
- What are the maximum number of bedrooms and bathrooms in a detached ADU?
- In general, what are the minimum side and rear setbacks for detached ADUs?

Respond in JSON, here is a sample response:
{{
    "minSetbacks": 4,
    "maxFloorArea": 1200,
    "minFloorArea": 220,
    "maxBedrooms": 2,
    "maxBathrooms": 1,
}}
"""


def get_agent():
    fns = [
        extract_city_state_pair_from_address,
        get_building_codes_digest_for_city_state_pair,
        query_building_codes_digest,
    ]
    tools = [FunctionTool.from_defaults(fn) for fn in fns]
    llm = OpenAI(model="gpt-3.5-turbo-0613")
    agent = ReActAgent.from_tools(tools, llm=llm, max_iterations=20, verbose=True)
    return agent


def query(address, callback):
    agent = get_agent()
    task = agent.create_task(_QUERY.format(address=address))
    step_output = agent.run_step(task.task_id)
    while not step_output.is_last:
        step_output = agent.run_step(task.task_id)
        callback(f"Agent: {step_output.output.response}")
    response = agent.finalize_response(task.task_id).response
    try:
        return json.loads(response)
    except:
        return response
