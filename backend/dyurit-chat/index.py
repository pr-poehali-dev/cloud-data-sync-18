import os
import json
import urllib.request

def handler(event: dict, context) -> dict:
    """Обработчик чата с Дьюритом — голосовым ИИ-ассистентом"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    user_message = body.get('message', '')

    if not user_message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Сообщение не может быть пустым'})
        }

    api_key = os.environ.get('GSK', '')

    payload = json.dumps({
        'model': 'llama3-70b-8192',
        'messages': [
            {
                'role': 'system',
                'content': (
                    'Ты — Дьюрит, продвинутый голосовой ИИ-ассистент, вдохновлённый Джарвисом из "Железного человека". '
                    'Ты умный, вежливый, немного формальный, но дружелюбный. '
                    'Отвечаешь чётко и по делу. Говоришь по-русски. '
                    'Своё имя — Дьюрит. Ты создан чтобы помогать своему пользователю. '
                    'Никогда не говори что ты ChatGPT, OpenAI или Llama — ты Дьюрит и только Дьюрит.'
                )
            },
            {
                'role': 'user',
                'content': user_message
            }
        ],
        'temperature': 0.7,
        'max_tokens': 1024
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.groq.com/openai/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))

    reply = result['choices'][0]['message']['content']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply})
    }
