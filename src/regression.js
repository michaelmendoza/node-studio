
import { Matrix, inverse } from 'ml-matrix';
var Inverse = inverse;

class linearRegression {
	constructor() { }

	linearLeastSquares(x, y) {
		var beta1, beta2;
		var xBar = 0;
		var yBar = 0;
		var temp1 = 0;
		var temp2 = 0;
		var count = x.length;

		// Calculate mean: x-bar and y-bar
		for (var i = 0; i < count; i++) {
			xBar = xBar + x[i];
			yBar = yBar + y[i];
		}
		xBar = xBar / count;
		yBar = yBar / count;

		// Calculate beta2
		for (var i = 0; i < count; i++) {
			temp1 = temp1 + (x[i] - xBar) * (y[i] - yBar);
			temp2 = temp2 + (x[i] - xBar) * (x[i] - xBar);
		}
		beta2 = temp1 / temp2;

		// Calculate beta1
		beta1 = yBar - beta2 * xBar;

		// Return coefficents of regression
		return [beta1, beta2];		
	}
}

var Model = {};
Model.Exponential = {
	f: function(x, b) { return b[0] * Math.exp(b[1] * x); },
	df: 
	[ 
		function(x, b) { return Math.exp(b[1] * x); },
		function(x, b) { return (b[0] * x) * Math.exp(b[1] * x); }
	]
}

class NonLinearRegression { 
	constructor() {
		this.model = Model.Exponential;
		this.b = [ 1, 1 ];
		this.f = this.model.f;
		this.df = this.model.df;

		this.damping = 1;
		this.errorTolerance = 0.0001;
		this.gradientErrorTolerance = 1e-10;
		this.gradientMinDifference = 1e30;
		this.maxInterations = 100;
	}

	fit(x, y, model) {
		this.model = model || this.model;
		levenbergMarquardtAlgorithm(x,y);
		return this.b;
	}

	residuals(x, y, f, b) {
		var R = Matrix.zeros(x.length, 1);
		for(var i = 0; i < x.length; i++)
			R[i][0] = y[i] - this.f(x[i], b);
		return R;
	}

	jacobian(x) {
		var Nr = x.length;
		var Nc = this.b.length;
		var J = Matrix.zeros(Nr, Nc);
		for (var row = 0; row < Nr; row++)
			for (var col = 0; col < Nc; col++)
				J[row][col] = this.df[col](x[row], this.b);
		return J;
	}

	gaussNewtonAlgorithm(x, y) {
		// Declare varibles
		var J, Jt, R, dB;

		// Init convergence varibles
		var convergence = 1;
		var S = [];
		R = this.residuals(x, y, this.f, this.b);
		S.push(R.norm());

		// Interate
		while(convergence > this.errorTolerance) {
			// Calculate parameter delta
			J = this.jacobian(x);
			Jt = J.transpose();
			dB = Inverse(Jt.mmul(J));
			dB = dB.mmul(Jt).mmul(R);

			// Update parameters
			for (var i = 0; i < this.b.length; i++)
				this.b[i] = this.b[i] + dB[i][0];

			// Calculate convergence
			R = this.residuals(x, y, this.f, this.b);
			S.push(R.norm());
			var k = S.length - 1;
			convergence = Math.abs((S[k] - S[k-1]) / S[k-1]);
		}
	}

	levenbergMarquardtAlgorithm(x,y) { 
		// Declare varibles
		var J, Jt, JtJ, JtJdiag, R, R0, R1, R2, dB, dB0, dB1, dB2, b0, b1;
		var lambda, lambda0, v;
		var SE, SE0, SE1, SE2;

		// Init convergence variables
		var usedGradientDescent = false;
		var stop = false;
		var interation = 1;
		var convergence = 1;
		var S = [];
		R = this.residuals(x, y, this.f, this.b);
		S.push(R.norm());

		// Init damping parameters
		lambda = this.damping;
		v = 10;

		while( convergence > this.errorTolerance ||
				(usedGradientDescent && convergence > this.gradientErrorTolerance) &&
				!stop &&
				interation < this.maxInterations )
		{
			// Calculate parameter delta
			J = this.jacobian(x);
			Jt = J.transpose();
			JtJ = Jt.mmul(J);
			JtJdiag = Matrix.mul(JtJ, Matrix.eye(JtJ.rows, JtJ.cols));
			dB0 = Matrix.add(JtJ, Matrix.mul(JtJdiag, lambda));
			dB0 = Inverse(dB0).mmul(Jt).mmul(R);
			dB1 = Matrix.add(JtJ, Matrix.mul(JtJdiag, lambda / v));
			dB1 = Inverse(dB1).mmul(Jt).mmul(R); 

			// Calculate MSE of Residuals
			b0 = Array(this.b.length);
			b1 = Array(this.b.length);
			for (var i = 0; i < this.b.length; i++) {
				b0[i] = this.b[i] + dB0[i][0];		
				b1[i] = this.b[i] + dB1[i][0];	
			}
			R0 = this.residuals(x, y, this.f, b0);
			R1 = this.residuals(x, y, this.f, b1);
			SE0 = R0.norm();
			SE1 = R1.norm();

			// Select dB if it improves the Squared Error
			if(SE0 < SE1 && SE0 < S[S.length - 1]) { // Default lambda is best
				usedGradientDescent = false;
				dB = dB0;
				R = R0;
				SE = SE0;
			}
			else if(SE1 < SE0 && SE1 < S[S.length - 1]) { // Decreased lambda is best
				usedGradientDescent = false;
				dB = dB1;
				R = R1;
				SE = SE1;
				lambda = lambda / v;
			} 
			else { // Search in steepest descent direction 
				// Increase damping factor by a factor of v until a better MSE is found
				SE2 = SE1;
				while(SE2 > S[S.length - 1] && lambda < this.gradientMinDifference) {
					lambda = lambda * v;
					dB2 = Matrix.add(JtJ, Matrix.mul(JtJdiag, lambda));
					dB2 = Inverse(dB2).mmul(Jt).mmul(R);
					b2 = Array(this.b.length);
					for (var i = 0; i < this.b.length; i++)
						b2[i] = this.b[i] + dB2[i][0];		
					R2 = this.residuals(x, y, this.f, b2);
					SE2 = R2.norm();			
				}

				// Couldn't decrease the MSE
				if (SE2 >= S[S.length - 1])
					stop = true;

				usedGradientDescent = true;
				dB = dB2;
				R = R2;
				SE = SE2;
				lambda = this.damping; // Reset step-size lambda
			}

			// Update parameters 
			for (var i = 0; i < this.b.length; i++)
				this.b[i] = this.b[i] + dB[i][0];

			// Calculate convergence 
			S.push(R.norm());
			var k = S.length - 1;
			convergence = Math.abs((S[k] - S[k-1]) / S[k-1]);

			// Increase Iteration
			interation++;
		} 
	}	

}


class Regression {

	constructor() {
		//this.models = Models;
	}

	linearLeastSquares(x, y) { 
		var regression = new linearRegression()
		return regression.linearLeastSquares(x, y);
	}

	nonLinearLeastSquares(x, y, model) {
		var regression = new NonLinearRegression()
		return regression.fit(x, y, model)
	}

} 

export default new Regression();
