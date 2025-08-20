using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using Reporting.Application.Abstractions;

namespace Reporting.Application.Metrics.GetOverview;

public sealed record GetOverviewQuery(DateTime From, DateTime To) : IRequest<OverviewVm>;

