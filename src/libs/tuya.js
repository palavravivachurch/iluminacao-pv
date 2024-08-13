import axios from 'axios'

const authKey = "88d59e5d-8ea7-4cb9-9406-55d2fe34870a:fx"; // Replace with your key

const defaults = {
  region: 'us'
}

async function translateText(text) {
  const url = `https://api-free.deepl.com/v2/translate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `DeepL-Auth-Key ${authKey}`,
    },
    body: JSON.stringify({
      text: [text],
      target_lang: 'PT-BR',
      source_lang: 'EN',
      formality: 'less'
    }),
  });

  const data = await response.json();
  return data.translations[0].text
}

async function ensureSuccess(response) {
  const data = response.data
  if (typeof data !== 'object') {
    throw new Error(data)
  }
  if (data.access_token) {
    return
  }
  if (data.responseStatus === 'error') {
    const result = await translateText(data.errorMsg);
    throw new Error(result)
  }
  if (!data.header || data.header.code !== 'SUCCESS') {
    const result = await translateText(data.header.msg);
    throw new Error(result)
  }
}

function HomeAssistantClient(session) {
  let client
  if (session) {
    client = createClient(session.region)
  }

  function createClient(region) {
    return axios.create({baseURL: '/api/homeassistant', params: {region}})
  }

  function normalizeToken(token) {
    const result = {
      ...token,
      expires: Math.trunc((Date.now() / 1000)) + token.expires_in
    }
    delete result.expires_in
    return result
  }

  this.login = async (userName, password, region) => {
    region = region || defaults.region

    client = createClient(region)

    const authResponse = await client.post('/auth.do', new URLSearchParams({
      userName,
      password,
      countryCode: '00',
      bizType: 'smart_life',
      from: 'tuya'
    }))
    console.debug('auth.do', userName, authResponse.data)
    await ensureSuccess(authResponse)

    session = {
      region,
      token: normalizeToken(authResponse.data)
    }
  }

  this.refreshAuthToken = async () => {
    const accessResponse = await client.post('/access.do', {
      grant_type: 'refresh_token',
      refresh_token: session.token.refresh_token,
      rand: Math.random()
    })
    console.debug('access.do', accessResponse.data)
    await ensureSuccess(accessResponse)

    session.token = normalizeToken(accessResponse.data)
  }

  this.getSession = () => session

  this.dropSession = () => {
    session = null
  }

  this.deviceDiscovery = async () => {
    const discoveryResponse = await client.post('/skill', {
      header: {
        payloadVersion: 1,
        namespace: 'discovery',
        name: 'Discovery'
      },
      payload: {
        accessToken: session.token.access_token
      }
    })
    console.debug('device discovery response', discoveryResponse.data)
    await ensureSuccess(discoveryResponse)

    const payload = discoveryResponse.data.payload
    if (payload?.devices) {
      // fix payload data
      payload.devices = payload.devices
        .map(device => {
          console.log(device)
          // workaround json escaped signes
          device.name = JSON.parse(`"${device.name}"`)

          // workaround automation type
          if (device.dev_type === 'scene' && device.name.endsWith('#')) {
            device.dev_type = 'automation'
            device.name = device.name.replace(/\s*#$/, '')
          }

          return {
            id: device.id,
            name: device.name,
            type: device.dev_type,
            data: device.data,
            icon: device.icon
          }
        })
        .filter(device => device.type === "switch")
        .sort((b, a) => {
          const order = ["Geral Nave 1", "Geral Nave 2", "Centro Nave 1", "Centro Nave 2", "Direita Nave 1", "Direita Nave 2", "Esquerda Nave 1", "Esquerda Nave 2"];

          const aIndex = order.findIndex((prefix) => a.name.startsWith(prefix));
          const bIndex = order.findIndex((prefix) => b.name.startsWith(prefix));

          return aIndex - bIndex;
        });
    }

    return discoveryResponse.data
  }

  // actions = ['turnOnOff', 'brightnessSet', 'colorSet', 'colorTemperatureSet']
  this.deviceControl = async (deviceId, action, fieldValue, fieldName) => {
    // for testing purpose only
    if (deviceId === 0) {
      return {header: {code: 'SUCCESS'}}
    }

    fieldName = fieldName || 'value'

    if (action === 'turnOnOff' &&
      fieldName === 'value' &&
      typeof fieldValue === 'boolean') {
      fieldValue = fieldValue ? 1 : 0
    }

    const controlResponse = await client.post('/skill', {
      header: {
        payloadVersion: 1,
        namespace: 'control',
        name: action
      },
      payload: {
        accessToken: session.token.access_token,
        devId: deviceId,
        [fieldName]: fieldValue
      }
    })
    console.debug('device control response', `${action}: ${fieldName}=${fieldValue}`, controlResponse.data)
    await ensureSuccess(controlResponse)
  }
}

export default {
  HomeAssistantClient
}
