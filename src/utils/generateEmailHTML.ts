export const generateEmailHTML = (resetToken: string) => `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <link rel="preload" as="image" href="https://react-email-demo-kkea02irk-resend.vercel.app/static/aws-logo.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" /><!--$-->
</head>

<body style="background-color:#fff;color:#212121">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
        style="max-width:37.5em;padding:20px;margin:0 auto;background-color:#eee">
        <tbody>
            <tr style="width:100%">
                <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                        style="background-color:#fff">
                        <tbody>
                            <tr>
                                <td>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0"
                                        role="presentation" style="padding:25px 35px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <h1
                                                        style="color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px">
                                                        API - Reset your Password
                                                    </h1>
                                                    <p
                                                        style="font-size:14px;line-height:24px;margin:24px 0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin-bottom:14px">
                                                        We received a request to reset your password. Please use the
                                                        token below to complete the process:
                                                    </p>
                                                    <table align="center" width="100%" border="0" cellPadding="0"
                                                        cellSpacing="0" role="presentation"
                                                        style="display:flex;align-items:center;justify-content:center">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p
                                                                        style="font-size:14px;line-height:24px;margin:0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-weight:bold;text-align:center">
                                                                        Verification code</p>
                                                                    <p
                                                                        style="font-size:36px;line-height:24px;margin:10px 0;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-weight:bold;text-align:center">
                                                                        ${resetToken}</p>
                                                                    <p
                                                                        style="font-size:14px;line-height:24px;margin:0px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;text-align:center">
                                                                        (This code is valid for 10 minutes)</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea" />
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0"
                                        role="presentation" style="padding:25px 35px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p
                                                        style="font-size:14px;line-height:24px;margin:0px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
                                                        If you didnt request this, please ignore this email.
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table><!--/$-->
</body>

</html>
`;
