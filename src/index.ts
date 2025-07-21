/**
 * Main entry point for the application
 */
import { local } from '@polkadot-api/descriptors'
import { createClient, TypedApi, Binary } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';

const SUB_LOCAL_URL = 'ws://localhost:9944'

async function getLocalApi(): Promise<TypedApi<typeof local>> {
    let provider = getWsProvider(SUB_LOCAL_URL)
    let client = await createClient(provider)
    const api = client.getTypedApi(local)

    return api
}

async function main(): Promise<void> {
    const api = await getLocalApi()

    // Create a System::remark call using the API
    const systemRemarkCall = api.tx.System.remark({
        remark: Binary.fromText("Hello")
    })

    const res = await api.view.Proxy.check_permissions(
        systemRemarkCall.decodedCall,
        { type: "Any", value: undefined }  // Complete enum object
    )
    console.log(res)
}

// Run the main function
if (require.main === module) {
    main();
}

