import axios from "axios";
import {
    ChannelAuthorizationCallback,
    ChannelAuthorizerGenerator
} from "pusher-js";

export const authorizerFn = (authToken: string): ChannelAuthorizerGenerator => {
    return (channel) => ({
        authorize: async (socketId: string, callback: ChannelAuthorizationCallback) => {
            try {
                const endpoint = "https://income-api.copperx.io/api/notifications/auth";
                const response = await axios.post(
                    endpoint,
                    {
                        socket_id: socketId,
                        channel_name: channel.name
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
        
                if (response.data) {
                    callback(null, response.data);
                } else {
                    callback(new Error("Pusher authentication failed"), null);
                }
            } catch (error: any) {
                console.error(`Pusher authorization error: ${error}`);
                callback(error, null);
            }
        }
    })
}
