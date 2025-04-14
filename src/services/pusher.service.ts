import axios from "axios";
import Pusher, {
    ChannelAuthorizationCallback,
    ChannelAuthorizerGenerator
} from "pusher-js";
import {
    PUSHER_KEY,
    PUSHER_CLUSTER,
    PUSHER_API_KEY
} from "../config";

const authorizerFn: ChannelAuthorizerGenerator = (channel) => {
    return {
        authorize: async (socketId: string, callback: ChannelAuthorizationCallback) => {
            try {
                const response = await axios.post(
                    "/api/notifications/auth",
                    {
                        socket_id: socketId,
                        channel_name: channel.name
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${PUSHER_API_KEY}`
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
    }
}

export const pusherClient = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    authorizer: authorizerFn
});

