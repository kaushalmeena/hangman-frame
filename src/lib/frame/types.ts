export type FrameVersion = "vNext" | `${number}-${number}-${number}`;

export type ImageAspectRatio = "1.91:1" | "1:1";

export type ClientProtocolId = { id: string; version: string };

export type FrameButtonLink = {
  action: "link";
  target: string;
  post_url?: undefined;
  /** A 256-byte string which is label of the button */
  label: string;
};

export type FrameButtonPost = {
  /**
   * Must be post or post_redirect. Defaults to post if no value was specified.
   * If set to post, app must make the POST request and frame server must respond with a 200 OK, which may contain another frame.
   * If set to post_redirect, app must make the POST request, and the frame server must respond with a 302 OK with a location property set on the header. */
  action: "post" | "post_redirect";
  /**
   * POST the packet to fc:frame:button:$idx:action:target if present
   * POST the packet to fc:frame:post_url if target was not present.
   */
  target?: string;
  post_url?: string;
  /** A 256-byte string which is label of the button */
  label: string;
};

export type FrameButtonMint = {
  action: "mint";
  /** The target  property MUST be a valid [CAIP-10](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-10.md) address, plus an optional token_id . */
  target: string;
  post_url?: string;
  /** A 256-byte string which is label of the button */
  label: string;
};

export type FrameButtonTx = {
  action: "tx";
  target: string;
  post_url?: string;
  /** A 256-byte string which is label of the button */
  label: string;
};

export type FrameButton =
  | FrameButtonPost
  | FrameButtonLink
  | FrameButtonMint
  | FrameButtonTx;

export type Frame = {
  /**
   * A valid frame version string.
   * The string must be a release date (e.g. 2020-01-01 ) or vNext.
   * */
  version: FrameVersion;
  /**
   * A 256-byte string which contains a valid URL to send the Signature Packet to.
   * If this prop is not present, apps must POST to the frame URL.
   * */
  postUrl: string;
  /**
   * A page may contain 0 to 4 buttons.
   * If more than 1 button is present, the idx values must be in sequence starting from 1 (e.g. 1, 2 3).
   * If a broken sequence is present (e.g 1, 2, 4), apps must not render the frame and instead render an OG embed.
   * */
  buttons?: FrameButton[];
  /** An image which should have an aspect ratio of 1.91:1 or 1:1 */
  image: string;
  /** Must be either `1.91:1` or `1:1`. Defaults to `1.91:1` */
  imageAspectRatio?: ImageAspectRatio;
  /**
   * An image which should have an aspect ratio of 1.91:1.
   * Fallback for clients that do not support frames.
   * */
  ogImage?: string;
  /**
   * Adding this property enables the text field.
   * The content is a 32-byte label that is shown to the user (e.g. Enter a message).
   * */
  inputText?: string;
  /**
   * Frame servers may set this value and apps must sign and include it in the Frame Signature Packet.
   * May be up to 4kb
   * */
  state?: string | object;
  /** Open Frames spec: The minimum client protocol version accepted for the given protocol identifier. */
  accepts?: ClientProtocolId[];
};

export type ActionMetadata = {
  /** The action name. Must be less than 30 characters. */
  name: string;
  /** An [Octicons](https://primer.style/foundations/icons) icon name. */
  icon: string;
  /** A short description up to 80 characters. */
  description: string;
  /** Optional. External link to an "about" page for extended description. */
  aboutUrl?: string;
  /**
   * The action type. (Same type options as frame buttons).
   * Only post is accepted in V1.
   * */
  action: {
    type: "post";
    postUrl: string;
  };
};

export type EthSendTransactionParams = {
  /** JSON ABI which must include encoded function type and should include potential error types. Can be empty.  */
  abi: object | [];
  /** Transaction to address */
  to: string;
  /** Value of ether to send with the transaction in wei. Optional. */
  value?: string;
  /** Transaction call data. Optional. */
  data?: string;
  /** Transaction gas value. Optional. */
  gas?: string;
  /** Transaction gas limit value. Optional. */
  gasLimit?: string;
};

export type TransactionTargetResponse = {
  chainId: string;
  method: "eth_sendTransaction";
  attribution?: boolean;
  params: EthSendTransactionParams;
};

export type EthSignTypedDataV4Params = {
  domain?: {
    chainId?: number;
    name?: string;
    salt?: string;
    verifyingContract?: string;
    version?: string;
  };
  types: object;
  primaryType: string;
  message: Record<string, unknown>;
};

export type SignatureTargetResponse = {
  chainId: string;
  method: "eth_signTypedData_v4";
  params: EthSignTypedDataV4Params;
};

export type FrameActionPayload = {
  trustedData: { messageBytes: string };
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: 1 | 2 | 3 | 4;
    castId: {
      fid: number;
      hash: string;
    };
    inputText?: string;
    state?: string;
    transactionId?: string;
    address?: string;
  };
  clientProtocol?: string;
  secret?: string;
};

export type ValidatedFrameMessage = {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    frameActionBody: {
      url: string;
      buttonIndex: number;
      castId: {
        fid: number;
        hash: string;
      };
      inputText: string;
      state: string;
      transactionId?: string;
      address?: string;
    };
  };
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
};
