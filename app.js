var createError = require('http-errors');
var express = require("express");
var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { RewriteFrames } = require('@sentry/integrations');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const path = require('path');
var app = express();

Sentry.init({
  dsn: "https://6aa42d67bdeda42f0b5c25806407190d4@o4504887889297408.ingest.sentry.io/4504954672119808", //TODO: Update your dsn from sentry
  integrations: [
    new RewriteFrames(),
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.use(Sentry.Handlers.errorHandler());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
module.exports = app;
