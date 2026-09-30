/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
// Quality: lossless PNG frames, low CRF and a slower preset keep text crisp;
// yuv420p (limited range) plays correctly in WeChat and phone players.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCrf(12);
Config.setX264Preset("slow");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
