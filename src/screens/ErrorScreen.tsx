import type { AppRouter } from "@/server/trpc/router/_app";
import type { TRPCClientErrorLike } from "@trpc/client";

const ErrorScreen = ({ error }: { error?: TRPCClientErrorLike<AppRouter> }) => {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col gap-5">
        <div className="text-xl font-semibold text-title md:text-3xl">
          {error?.message ?? "Something went wrong"}
        </div>
        <table>
          <thead className="text-sm font-medium text-text md:text-base">
            <tr>
              <th className="text-left">Try doing these:</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-text md:text-base">
            <tr>
              <td>1. Spine transfer to nosegrab frontflip</td>
            </tr>
            <tr>
              <td>2. Wall flip to natas spin</td>
            </tr>
            <tr>
              <td>3. Sticker slap to manual to wallplant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ErrorScreen;
